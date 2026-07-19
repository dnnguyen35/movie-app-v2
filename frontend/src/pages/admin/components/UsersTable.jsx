import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Lock, LockOpen } from "@mui/icons-material";
import adminApi from "../../../api/modules/admin.api";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const UsersTable = ({ listUsersData, isLoading }) => {
  const [listUsers, setListUsers] = useState([]);
  const [onRequest, setOnRequest] = useState(false);

  useEffect(() => {
    setListUsers(listUsersData);
  }, [listUsersData]);

  const onLockUserClick = async (user) => {
    if (onRequest) return;

    if (!user.isActive) {
      onUnLockUser(user.id);
      return;
    }

    setOnRequest(true);
    const { response, error } = await adminApi.lockUser({ userId: user.id });
    setOnRequest(false);

    if (error) toast.error(error.message);

    if (response) {
      toast.success("Locked user successfully");
      setListUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, active: false } : u)),
      );
    }
  };

  const onUnLockUser = async (userId) => {
    if (onRequest) return;

    setOnRequest(true);
    const { response, error } = await adminApi.unLockUser({ userId: userId });
    setOnRequest(false);

    if (error) toast.error(error.message);

    if (response) {
      toast.success("Unlocked user successfully");
      setListUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, active: true } : u)),
      );
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: { xs: 300, md: 500 },
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "primary.main",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              Email
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              Username
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              Created At
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              Total Reviews
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              Total Favorites
            </TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            listUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.totalReviews}</TableCell>
                <TableCell>{user.totalFavorites}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => onLockUserClick(user)}
                    color={user.active ? "success" : "error"}
                  >
                    {user.active ? <LockOpen /> : <Lock />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
