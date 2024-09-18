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
  Select,
  SelectItem,
} from "@nextui-org/react";
import * as XLSX from "xlsx";
import client from "@/utils/client";
import { toast, ToastContainer } from "react-toastify";
import CustomModal from "@/components/CustomModal";

interface Job {
  _id: string;
  title: string;
  company: { name: string; location: string };
  salary: { min: number; max: number; currency: string };
  jobDescription: string;
  requirements: string[];
  responsibilities: string[];
  employmentType: string;
  experienceLevel: string;
  benefits: string[];
  deadline: string;
  tags: string[];
  isRemote: boolean;
  postedDate: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}

const headerColumns = [
  { key: "title", title: "Job Title", allowSorting: true },
  { key: "company", title: "Company", allowSorting: true },
  { key: "location", title: "Location", allowSorting: true },
  { key: "salary", title: "Salary", allowSorting: true },
  { key: "employmentType", title: "Type", allowSorting: true },
  { key: "experienceLevel", title: "Experience", allowSorting: true },
  { key: "isRemote", title: "Remote", allowSorting: true },
  { key: "postedDate", title: "Posted Date", allowSorting: true },
  { key: "actions", title: "Actions", allowSorting: false },
];

const INITIAL_VISIBLE_COLUMNS = new Set([
  "title",
  "company",
  "location",
  "salary",
  "employmentType",
  "experienceLevel",
  "isRemote",
  "postedDate",
  "actions",
]);

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
  const [remoteFilter, setRemoteFilter] = useState<string>("all");
  const [employmentTypeFilter, setEmploymentTypeFilter] =
    useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredJobs = [...apiData];

    if (hasSearchFilter) {
      filteredJobs = filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (remoteFilter !== "all") {
      filteredJobs = filteredJobs.filter(
        (job) => job.isRemote === (remoteFilter === "remote")
      );
    }

    if (employmentTypeFilter !== "all") {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.employmentType.toLowerCase() ===
          employmentTypeFilter.toLowerCase()
      );
    }

    if (activeFilter !== "all") {
      filteredJobs = filteredJobs.filter(
        (job) => job.isActive === (activeFilter === "active")
      );
    }

    return filteredJobs;
  }, [
    filterValue,
    apiData,
    hasSearchFilter,
    remoteFilter,
    employmentTypeFilter,
    activeFilter,
  ]);

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
      //@ts-ignore
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((job: Job, columnKey: string) => {
    switch (columnKey) {
      case "company":
        return job.company.name;
      case "location":
        return job.company.location;
      case "salary":
        return `${job.salary.currency} ${job.salary.min} - ${job.salary.max}`;
      case "isRemote":
        return (
          <Chip
            className="capitalize"
            color={job.isRemote ? "success" : "default"}
            size="sm"
            variant="flat"
          >
            {job.isRemote ? "Remote" : "On-site"}
          </Chip>
        );
      case "postedDate":
        return new Date(job.postedDate).toLocaleDateString();
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
        return job[columnKey as keyof Job] as React.ReactNode;
    }
  }, []);

  const onPageChange = (page: number) => {
    setPage(page);
  };

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
    console.log("Opening modal for job:", job);
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
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center mb-4">
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
            <Button className="text-white bg-gray-700">Add New</Button>
            <Button
              color="primary"
              onClick={handleExport}
              className="text-white"
            >
              Export to Excel
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          <Select
            placeholder="Remote"
            className="max-w-xs min-w-[150px]"
            onChange={(e) => setRemoteFilter(e.target.value)}
          >
            <SelectItem key="all" value="all">
              All
            </SelectItem>
            <SelectItem key="remote" value="remote">
              Remote
            </SelectItem>
            <SelectItem key="onsite" value="onsite">
              On-site
            </SelectItem>
          </Select>
          <Select
            placeholder="Employment Type"
            className="max-w-xs min-w-[150px]"
            onChange={(e) => setEmploymentTypeFilter(e.target.value)}
          >
            <SelectItem key="all" value="all">
              All
            </SelectItem>
            <SelectItem key="fulltime" value="fulltime">
              Full-time
            </SelectItem>
            <SelectItem key="parttime" value="parttime">
              Part-time
            </SelectItem>
            <SelectItem key="contract" value="contract">
              Contract
            </SelectItem>
          </Select>
          <Select
            placeholder="Active Status"
            className="max-w-xs min-w-[150px]"
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <SelectItem key="all" value="all">
              All
            </SelectItem>
            <SelectItem key="active" value="active">
              Active
            </SelectItem>
            <SelectItem key="inactive" value="inactive">
              Inactive
            </SelectItem>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
          <span className="text-default-400 font-semibold text-small">
            Total {filteredItems.length} jobs
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
    filteredItems.length,
    onSearchChange,
    onClear,
    handleExport,
    remoteFilter,
    employmentTypeFilter,
    activeFilter,
  ]);

  return (
    <div className="p-4">
      <ToastContainer />
      <CustomModal
        isVisible={isVisible}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        description="Are you sure you want to delete this job? This action cannot be undone."
      />
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
                    {visibleColumns.has(column.key)
                      ? renderCell(job, column.key)
                      : null}
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
