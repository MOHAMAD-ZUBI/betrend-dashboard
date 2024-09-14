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
  User,
  Pagination,
} from "@nextui-org/react";

// Define types for the user and permissions
interface Permissions {
  type: string[];
}

interface UserData {
  _id: string;
  userName: string;
  email: string;
  permissions?: Permissions;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  cameFrom?: string;
  [key: string]: any; // Add index signature to handle dynamic properties
}

// Define the mapping for status colors
const statusColorMap: Record<any, "success" | "danger"> = {
  true: "success",
  false: "danger",
};

const INITIAL_VISIBLE_COLUMNS: Set<string> = new Set([
  "userName",
  "email",
  "permissions",
  "isVerified",
  "actions",
]);

const headerColumns = [
  { key: "userName", title: "Username", allowSorting: true },
  { key: "email", title: "Email", allowSorting: true },
  { key: "permissions", title: "Permissions", allowSorting: false },
  { key: "isVerified", title: "Verified", allowSorting: true },
  { key: "actions", title: "Actions", allowSorting: false },
];

export default function App({ apiData }: { apiData: UserData[] }) {
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    INITIAL_VISIBLE_COLUMNS
  );
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof UserData;
    direction: "ascending" | "descending";
  }>({
    column: "userName",
    direction: "ascending",
  });
  const [page, setPage] = useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...apiData];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.userName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
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

  const renderCell = useCallback((user: UserData, columnKey: string) => {
    const cellValue = user[columnKey as keyof UserData];

    switch (columnKey) {
      case "userName":
        return (
          <User description={user.email} name={cellValue as string}>
            {user.email}
          </User>
        );
      case "permissions":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {user?.permissions?.type?.join(", ") || "None"}
            </p>
          </div>
        );
      case "isVerified":
        return (
          <Chip
            className="capitalize"
            //@ts-ignore
            color={
              user.isVerified ? statusColorMap[true] : statusColorMap[false]
            }
            size="sm"
            variant="flat"
          >
            {user.isVerified ? "Verified" : "Not Verified"}
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
                <DropdownItem>Delete</DropdownItem>
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

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            value={filterValue}
            color="success"
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button color="success" className="text-white">
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-default-400 font-semibold text-small">
            Total {apiData.length} users
          </span>
          <label className="flex items-center font-semibold text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
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
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys.size === 0
            ? "No items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          color="success"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            onClick={onPreviousPage}
            color="success"
            className=" text-white"
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1 || page === pages}
            onClick={onNextPage}
            color="success"
            className=" text-white"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    page,
    pages,
    selectedKeys,
    filteredItems.length,
    onNextPage,
    onPreviousPage,
  ]);

  return (
    <div className="p-4">
      {topContent}
      <Table aria-label="Table with multiple selectable rows">
        <TableHeader>
          {headerColumns.map((column) => (
            //@ts-ignore
            <TableColumn key={column.key} title={column.title} />
          ))}
        </TableHeader>
        <TableBody>
          {sortedItems.map((user) => (
            <TableRow key={user._id}>
              {headerColumns.map(({ key }) => (
                <TableCell key={key}>
                  {visibleColumns.has(key) && renderCell(user, key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {bottomContent}
    </div>
  );
}
