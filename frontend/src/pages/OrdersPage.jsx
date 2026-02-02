import { useEffect, useState } from "react";
import { useGetOrdersQuery } from "../stores/api/orderApi";
import { data, Link } from "react-router-dom";
import { format } from "date-fns";
import { DataGrid } from "@mui/x-data-grid";
import { useOrderStore } from "../stores/zustand/useOrderStore";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Container,
  TablePagination,
} from "@mui/material";
import {
  ShoppingBag as ShoppingBagIcon,
  RemoveShoppingCart as EmptyCartIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
const statusColors = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
  payment_failed: "error",
  completed: "success",
};

export default function OrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useGetOrdersQuery();
  const setOrders = useOrderStore((state) => state.setOrders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };


  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);
  useEffect(() => {
    if (orders) setOrders(orders);
  }, [orders]);
    if (isLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      );
    }
    if (isError) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: "error.light",
              color: "error.contrastText",
            }}
          >
            <Typography variant="h6">Error loading orders</Typography>
            <Typography variant="body1">Please try again later.</Typography>
          </Paper>
        </Container>
      );
    }
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          <ShoppingBagIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          My Orders
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <EmptyCartIcon
            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            You haven't placed any orders yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            startIcon={<ShoppingBagIcon />}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? orders.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : orders
                ).map((order) => (
                  <TableRow
                    key={order._id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="subtitle2">
                        #{order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status.replace(/_/g, " ")}
                        color={statusColors[order.status] || "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        component={Link}
                        to={`/orders/${order._id}`}
                        variant="outlined"
                        size="small"
                        startIcon={<ViewIcon />}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Container>
  );
}
