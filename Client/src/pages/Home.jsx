import { Box, Button, Paper, Stack, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Description } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const Home = () => {
  const navigate = useNavigate();
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log("rowsData =>", rowsData);

  const buttonStyle = {
    cursor: "pointer",
    marginRight: "5px",
    color: "#007bff",
  };

  // Function to format date to dd/mm/yy
  const formatDate = (date) => {
    return dayjs(date).format("DD/MM/YY");
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_VERCEL_URL}`);
      // console.log("loadData =>", res.data);
      const { data } = res;
      const updateRows = data.map((item, index) => ({
        ...item,
        id: item._id,
        date: formatDate(item.date),
        order: index + 1,
      }));
      setRowsData(updateRows);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemove = async (id) => {
    const confirmed = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การลบรายการนี้จะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบทิ้ง!",
      cancelButtonText: "ไม่, ยกเลิก",
      reverseButtons: true,
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_VERCEL_URL}/${id}`);
        await Swal.fire("ลบสำเร็จ!", "รายการถูกลบออกแล้ว", "success");
        loadData();
      } catch (err) {
        console.log(err);
        Swal.fire(
          "เกิดข้อผิดพลาด!",
          "เกิดข้อผิดพลาดในการลบรายการ โปรดลองอีกครั้ง",
          "error"
        );
      }
    }
  };

  const columns = [
    {
      field: "order",
      headerName: "ลำดับ",
      width: 150,
    },
    {
      field: "name",
      headerName: "ชื่อร้านค้า/บริษัท/บุคคล",
      width: 300,
    },
    {
      field: "address",
      headerName: "ที่อยู่",
      width: 300,
    },
    {
      field: "phone",
      headerName: "เบอร์โทร",
      width: 300,
    },
    {
      field: "email",
      headerName: "อีเมล์",
      width: 300,
    },
    {
      field: "date",
      headerName: "วันที่",
      width: 300,
    },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        const { row } = params;
        return (
          <>
            <Stack direction="row" space={2}>
              <Edit
                style={buttonStyle}
                onClick={() => {
                  navigate(`/form/${row._id}`);
                }}
              />
              <Delete
                style={buttonStyle}
                onClick={() => handleRemove(row._id)}
              />
            </Stack>
          </>
        );
      },
    },
  ];

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<Description />}
        onClick={() => navigate("form/create")}
        sx={{ mb: 3 }}
        style={{ fontSize: "1rem", padding: "7px 15px" }}
      >
        สร้างใบสั่งซื้อ
      </Button>

      <Paper sx={{ height: "800px" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid rows={rowsData} columns={columns} />
        )}
      </Paper>
    </Box>
  );
};

export default Home;
