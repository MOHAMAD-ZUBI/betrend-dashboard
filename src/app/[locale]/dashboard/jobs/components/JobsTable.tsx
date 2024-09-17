"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from "@nextui-org/react";
import * as XLSX from "xlsx";
import client from "@/utils/client";
import { toast, ToastContainer } from "react-toastify";
import CustomModal from "./CustomModal";

// Define types for the data
interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  company: string;
  isActive: boolean;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
}

// Define the mapping for status colors
const statusColorMap: Record<any, "success" | "danger"> = {
  true: "success",
  false: "danger",
};

const INITIAL_VISIBLE_COLUMNS: Set<string> = new Set([
  "title",
  "description",
  "requirements",
  "location",
  "company",
  "isActive",
  "applicantsCount",
  "actions",
]);

const headerColumns = [
  { key: "title", title: "Title", allowSorting: true },
  { key: "description", title: "Description", allowSorting: true },
  { key: "requirements", title: "Requirements", allowSorting: false },
  { key: "location", title: "Location", allowSorting: false },
  { key: "company", title: "Company", allowSorting: false },
  { key: "isActive", title: "Active", allowSorting: true },
  { key: "applicantsCount", title: "Applicants", allowSorting: true },
  { key: "actions", title: "Actions", allowSorting: false },
];

export default function JobsTable({ apiData }: { apiData: Job[] }) {
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    INITIAL_VISIBLE_COLUMNS
  );
  const [isVisible, setVisible] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof Job;
    direction: "ascending" | "descending";
  }>({
    column: "title",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);

  const [isAddModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [newJob, setNewJob] = useState<
    Omit<
      Job,
      "_id" | "createdAt" | "updatedAt" | "isActive" | "applicantsCount"
    >
  >({
    title: "",
    description: "",
    requirements: "",
    location: "",
    company: "",
  });

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredJobs = [...apiData];

    if (hasSearchFilter) {
      filteredJobs = filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredJobs;
  }, [filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const renderCell = useCallback((job: Job, columnKey: string) => {
    const cellValue = job[columnKey as keyof Job];

    switch (columnKey) {
      case "isActive":
        return (
          <Chip
            className="capitalize"
            //@ts-ignore
            color={statusColorMap[job.isActive]}
            size="sm"
            variant="flat"
          >
            {job.isActive ? "Active" : "Inactive"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-start items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="ghost">
                  <span className="text-green-500">...</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>
                  <button onClick={() => handleOpenModal(job)}>Delete</button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue as React.ReactNode;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleExport = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems, {
      header: headerColumns.map((col) => col.key),
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

    XLSX.writeFile(workbook, "JobsData.xlsx");
  }, [filteredItems]);

  const handleOpenModal = (job: Job) => {
    setSelectedJob(job);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleDelete = async () => {
    if (!selectedJob) return;

    try {
      await client.delete(`/jobs/${selectedJob._id}`);
      toast.success("Job deleted successfully!");
      setVisible(false);
      // Trigger a re-fetch or update your local state here
    } catch (error) {
      toast.error("Error deleting job");
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between gap-3 items-center mb-4">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] text-gray-700"
            placeholder="Search by job title..."
            variant="faded"
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              className="text-white bg-gray-700"
              onClick={() => setAddModalVisible(true)}
            >
              Add New
            </Button>
            <Button
              color="primary"
              onClick={handleExport}
              className="text-white"
            >
              Export to Excel
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-default-400 font-semibold text-small">
            Total {apiData.length} jobs
          </span>
          <label className="flex items-center font-semibold text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onRowsPerPageChange,
    apiData.length,
    onSearchChange,
    onClear,
    handleExport,
  ]);

  return (
    <div className="p-4">
      <ToastContainer />
      <CustomModal
        isOpen={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        title="Add New Job"
        onSubmit={() => {}}
        className="w-[400px]"
      >
        <Input
          fullWidth
          placeholder="Title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
        />
        <Input
          fullWidth
          placeholder="Description"
          value={newJob.description}
          onChange={(e) =>
            setNewJob({ ...newJob, description: e.target.value })
          }
        />
        <Input
          fullWidth
          placeholder="Requirements"
          value={newJob.requirements}
          onChange={(e) =>
            setNewJob({ ...newJob, requirements: e.target.value })
          }
        />
        <Input
          fullWidth
          placeholder="Location"
          value={newJob.location}
          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
        />
        <Input
          fullWidth
          placeholder="Company"
          value={newJob.company}
          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
        />
      </CustomModal>
      {topContent}
      <div className="overflow-x-auto">
        <Table aria-label="Jobs Table" className="w-full">
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.title}</TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {sortedItems.map((job) => (
              <TableRow key={job._id}>
                {headerColumns.map((column) => (
                  <TableCell key={column.key}>
                    {visibleColumns.has(column.key) &&
                      renderCell(job, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          page={page}
          onChange={onPageChange}
          total={pages}
          className="mt-4"
        />
      </div>
    </div>
  );
}
