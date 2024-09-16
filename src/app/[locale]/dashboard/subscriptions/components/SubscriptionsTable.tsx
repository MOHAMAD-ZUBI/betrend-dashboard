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
interface Subscription {
  _id: string;
  userId: {
    userName: string;
    email: string;
  } | null; // Handle case where userId can be null
  plan: {
    name: string;
    price: number;
  };
  credits: number;
  startDate: string;
  endDate: string;
  __v: number;
}

// Define the mapping for status colors
const statusColorMap: Record<any, "success" | "danger"> = {
  true: "success",
  false: "danger",
};

const INITIAL_VISIBLE_COLUMNS: Set<string> = new Set([
  "userName",
  "email",
  "plan",
  "credits",
  "startDate",
  "endDate",
  "actions",
]);

const headerColumns = [
  { key: "userName", title: "User Name", allowSorting: true },
  { key: "email", title: "Email", allowSorting: true },
  { key: "plan", title: "Plan Name", allowSorting: true },
  { key: "credits", title: "Credits", allowSorting: true },
  { key: "startDate", title: "Start Date", allowSorting: true },
  { key: "endDate", title: "End Date", allowSorting: true },
  { key: "actions", title: "Actions", allowSorting: false },
];

export default function SubscriptionsTable({
  apiData,
}: {
  apiData: Subscription[];
}) {
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    INITIAL_VISIBLE_COLUMNS
  );
  const [isVisible, setVisible] = useState<boolean>(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof Subscription;
    direction: "ascending" | "descending";
  }>({
    column: "userName" as keyof Subscription,
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredSubscriptions = [...apiData];

    if (hasSearchFilter) {
      filteredSubscriptions = filteredSubscriptions.filter((sub) =>
        sub.userId?.userName?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredSubscriptions;
  }, [filterValue, apiData]);

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

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const renderCell = useCallback((sub: Subscription, columnKey: string) => {
    switch (columnKey) {
      case "userName":
        // Handle case where userId is null
        return sub.userId ? sub.userId.userName : "N/A";
      case "email":
        // Handle case where userId is null
        return sub.userId ? sub.userId.email : "N/A";
      case "plan":
        return `${sub.plan.name} (${sub.plan.price} USD)`;
      case "credits":
        return sub.credits;
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
                  <button onClick={() => handleOpenModal(sub)}>Delete</button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return sub[columnKey as keyof Subscription] as React.ReactNode;
    }
  }, []);

  const handleExport = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems, {
      header: headerColumns.map((col) => col.key),
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscriptions");

    XLSX.writeFile(workbook, "SubscriptionsData.xlsx");
  }, [filteredItems]);

  const handleOpenModal = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleDelete = async () => {
    if (!selectedSubscription) return;

    try {
      await client.delete(`/subscriptions/${selectedSubscription._id}`);
      toast.success("Subscription deleted successfully!");
      setVisible(false);
    } catch (error) {
      toast.error("Error deleting subscription");
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between gap-3 items-center mb-4">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] text-gray-700"
            placeholder="Search by user name..."
            variant="faded"
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
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
            Total {apiData.length} subscriptions
          </span>
          <label className="flex items-center font-semibold text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, apiData.length]);

  return (
    <div className="p-4">
      <ToastContainer />
      <CustomModal
        isVisible={isVisible}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        description="Are you sure you want to delete this subscription? This action cannot be undone."
      />
      {topContent}
      <div className="overflow-x-auto">
        <Table aria-label="Subscriptions Table" className="w-full">
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn key={column.key}>{column.title}</TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {sortedItems.map((sub) => (
              <TableRow key={sub._id}>
                {headerColumns.map((column) => (
                  <TableCell key={column.key}>
                    {visibleColumns.has(column.key)
                      ? renderCell(sub, column.key)
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
