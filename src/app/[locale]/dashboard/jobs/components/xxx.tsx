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
// import CustomModal from "./CustomModal";

// Define types for the data
interface Job {
  _id: string;
  title: string;
  jobDescription: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  company: {
    name: string;
    location: string;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  isRemote: boolean;
  employmentType: string;
  experienceLevel: string;
  benefits: string[];
  deadline: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Define the mapping for status colors
const statusColorMap: { [key: string]: "success" | "danger" } = {
  true: "success",
  false: "danger",
};

const INITIAL_VISIBLE_COLUMNS: Set<string> = new Set([
  "title",
  "jobDescription",
  "requirements",
  "responsibilities",
  "location",
  "company",
  "salary",
  "isRemote",
  "employmentType",
  "experienceLevel",
  "benefits",
  "deadline",
  "tags",
  "actions",
]);

const headerColumns = [
  { key: "title", title: "Title", allowSorting: true },
  { key: "jobDescription", title: "Description", allowSorting: true },
  { key: "requirements", title: "Requirements", allowSorting: false },
  { key: "responsibilities", title: "Responsibilities", allowSorting: false },
  { key: "location", title: "Location", allowSorting: false },
  { key: "company", title: "Company", allowSorting: false },
  { key: "salary", title: "Salary", allowSorting: false },
  { key: "isRemote", title: "Remote", allowSorting: true },
  { key: "employmentType", title: "Employment Type", allowSorting: false },
  { key: "experienceLevel", title: "Experience Level", allowSorting: false },
  { key: "benefits", title: "Benefits", allowSorting: false },
  { key: "deadline", title: "Deadline", allowSorting: true },
  { key: "tags", title: "Tags", allowSorting: false },
  { key: "actions", title: "Actions", allowSorting: false },
];

export default function JobsTable({ apiData }: { apiData: Job[] }) {
  console.log({ apiData });
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
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: "",
    jobDescription: "",
    requirements: [],
    responsibilities: [],
    location: "",
    company: {
      name: "",
      location: "",
    },
    salary: {
      min: 0,
      max: 0,
      currency: "",
    },
    isRemote: false,
    employmentType: "",
    experienceLevel: "",
    benefits: [],
    deadline: "",
    tags: [],
  });

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredJobs = [...apiData];

    if (hasSearchFilter) {
      filteredJobs = filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Ensure all required fields are present
    return filteredJobs.map((job) => ({
      _id: job._id,
      title: job.title || "",
      jobDescription: job.jobDescription || "",
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      location: job.location || "",
      company: job.company || { name: "", location: "" },
      salary: job.salary || { min: 0, max: 0, currency: "" },
      isRemote: job.isRemote || false,
      employmentType: job.employmentType || "",
      experienceLevel: job.experienceLevel || "",
      benefits: job.benefits || [],
      deadline: job.deadline || "",
      tags: job.tags || [],
    }));
  }, [filterValue, apiData, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      //@ts-ignore
      const first = a[sortDescriptor.column];
      //@ts-ignore
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
      case "isRemote":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[job.isRemote ? "true" : "false"]}
            size="sm"
            variant="flat"
          >
            {job.isRemote ? "Remote" : "On-site"}
          </Chip>
        );
      case "requirements":
      case "responsibilities":
      case "benefits":
      case "tags":
        return (
          <ul>
            {((cellValue as string[]) || []).map(
              (item: string, index: number) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        );
      case "salary":
        return cellValue
          ? //@ts-ignore
            `${cellValue.min} - ${cellValue.max} ${cellValue.currency}`
          : "N/A";
      case "company":
        //@ts-ignore
        return cellValue ? `${cellValue.name}, ${cellValue.location}` : "N/A";
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
        return cellValue != null ? cellValue.toString() : "N/A";
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
    const headers = headerColumns
      .filter((column) => visibleColumns.has(column.key)) // Include only visible columns
      .map((column) => column.key);

    const worksheet = XLSX.utils.json_to_sheet(filteredItems, {
      header: headers,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");

    XLSX.writeFile(workbook, "JobsData.xlsx");
  }, [filteredItems, visibleColumns]);

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
      toast.error("Error deleting job!");
    }
  };

  const handleAddJob = async () => {
    try {
      await client.post("/jobs", newJob);
      toast.success("Job added successfully!");
      setAddModalVisible(false);
      // Trigger a re-fetch or update your local state here
    } catch (error) {
      toast.error("Error adding job!");
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
              value={rowsPerPage}
              onChange={onRowsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [apiData.length, filterValue, rowsPerPage]);

  return (
    <>
      <ToastContainer />
      {topContent}
      <div className="p-4">
        <Table aria-label="Jobs Table" className=" w-full">
          <TableHeader>
            {headerColumns
              .filter((column) => visibleColumns.has(column.key))
              .map((column) => (
                //@ts-ignore
                <TableColumn
                  key={column.key}
                  //@ts-ignore
                  allowSorting={column.allowSorting}
                >
                  {column.title}
                </TableColumn>
              ))}
          </TableHeader>
          <TableBody>
            {sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headerColumns.length}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((job) => (
                <TableRow key={job._id}>
                  {headerColumns
                    .filter((column) => visibleColumns.has(column.key))
                    .map((column) => (
                      <TableCell key={column.key}>
                        {renderCell(job, column.key)}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className=" flex justify-center flex-row mt-2">
          <Pagination
            total={pages}
            initialPage={1}
            page={page}
            onChange={onPageChange}
            // onNext={onNextPage}
            // onPrevious={onPreviousPage}
          />
        </div>
      </div>
      {/* Add your modals here */}
      {/* <CustomModal 
        visible={isVisible} 
        onClose={handleCloseModal} 
        onDelete={handleDelete}
        job={selectedJob}
      /> */}
    </>
  );
}
