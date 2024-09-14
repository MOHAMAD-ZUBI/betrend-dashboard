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
import CustomModal from "@/components/CustomModal";

// Define types for the data
interface Plan {
  _id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  isActive: boolean;
  features: string[];
}

// Define the mapping for status colors
const statusColorMap: Record<any, "success" | "danger"> = {
  true: "success",
  false: "danger",
};

const INITIAL_VISIBLE_COLUMNS: Set<string> = new Set([
  "name",
  "description",
  "credits",
  "price",
  "isActive",
  "features",
  "actions",
]);
type Feature = string;

const headerColumns = [
  { key: "name", title: "Plan Name", allowSorting: true },
  { key: "description", title: "Description", allowSorting: true },
  { key: "credits", title: "Credits", allowSorting: true },
  { key: "price", title: "Price", allowSorting: true },
  { key: "isActive", title: "Active", allowSorting: true },
  { key: "features", title: "Features", allowSorting: false },
  { key: "actions", title: "Actions", allowSorting: false },
];

export default function App({ apiData }: { apiData: Plan[] }) {
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    INITIAL_VISIBLE_COLUMNS
  );
  const [isVisible, setVisible] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof Plan;
    direction: "ascending" | "descending";
  }>({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredPlans = [...apiData];

    if (hasSearchFilter) {
      filteredPlans = filteredPlans.filter((plan) =>
        plan.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredPlans;
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

  const renderCell = useCallback((plan: Plan, columnKey: string) => {
    const cellValue = plan[columnKey as keyof Plan];

    switch (columnKey) {
      case "features":
        return (
          <div className="flex flex-col">
            {plan.features.map((feature: Feature, index: number) => (
              <p key={index} className="text-bold text-small capitalize">
                {feature}
              </p>
            ))}
          </div>
        );
      case "isActive":
        return (
          <Chip
            className="capitalize"
            //@ts-ignore
            color={statusColorMap[plan.isActive]}
            size="sm"
            variant="flat"
          >
            {plan.isActive ? "Active" : "Inactive"}
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
                  <button onClick={() => handleOpenModal(plan)}>Delete</button>
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
    // Convert the data to a format that can be used by XLSX
    const worksheet = XLSX.utils.json_to_sheet(filteredItems, {
      header: headerColumns.map((col) => col.key),
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plans");

    // Create an Excel file and trigger the download
    XLSX.writeFile(workbook, "PlansData.xlsx");
  }, [filteredItems]);

  const handleOpenModal = (plan: Plan) => {
    console.log("Opening modal for plan:", plan);
    setSelectedPlan(plan);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;

    try {
      await client.delete(`/plans/${selectedPlan._id}`);
      toast.success("Plan deleted successfully!");
      setVisible(false);
      // Trigger a re-fetch or update your local state here
    } catch (error) {
      toast.error("Error deleting plan");
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between gap-3 items-center mb-4">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] text-gray-700"
            placeholder="Search by plan name..."
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
        <div className="flex justify-between items-center mb-4">
          <span className="text-default-400 font-semibold text-small">
            Total {apiData.length} plans
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
        isVisible={isVisible}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        description="Are you sure you want to delete this plan? This action cannot be undone."
      />
      {topContent}
      <div className="overflow-x-auto">
        <Table aria-label="Plans Table" className="w-full">
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.title}</TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {sortedItems.map((plan) => (
              <TableRow key={plan._id}>
                {headerColumns.map((column) => (
                  <TableCell key={column.key}>
                    {visibleColumns.has(column.key)
                      ? renderCell(plan, column.key)
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
