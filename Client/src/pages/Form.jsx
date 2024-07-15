import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Typography,
  Stack,
  TextField,
  Grid,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Add, Save, Remove, ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid } from "@mui/x-data-grid";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const Form = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataItems, setDataItems] = useState([]);
  const [sumPrice, setSumPrice] = useState(0);
  const [sumDiscount, setSumDiscount] = useState(0);
  const [sumVat, setSumVat] = useState(0);
  const [summary, setSummary] = useState(0);
  const [loading, setLoading] = useState(false);
  // console.log("dataItems =>", dataItems);
  const formData = useForm({
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      date: dayjs(),
    },
  });
 
  useEffect(() => {
    if (id !== "create") {
      getDetailById();
    }
  }, []);
  const columns = [
    {
      field: "name",
      headerName: "สินค้า/บริการ",
      width: 400,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Box sx={{ m: 1 }}>
            <TextField
              value={row.name}
              onChange={(e) => handleChangeVal(e.target.value, "name", row)}
            />
          </Box>
        );
      },
    },
    {
      field: "description",
      headerName: "รายละเอียด",
      width: 400,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Box sx={{ m: 1 }}>
            <TextField
              value={row.description}
              onChange={(e) =>
                handleChangeVal(e.target.value, "description", row)
              }
            />
          </Box>
        );
      },
    },
    {
      field: "qty",
      headerName: "จำนวน",
      width: 200,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Box sx={{ m: 1 }}>
            <TextField
              type="number"
              value={row.qty}
              onChange={(e) => handleChangeVal(e.target.value, "qty", row)}
            />
          </Box>
        );
      },
    },
    {
      field: "price",
      headerName: "ราคา",
      width: 200,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Box sx={{ m: 1 }}>
            <TextField
              type="number"
              value={row.price}
              onChange={(e) => handleChangeVal(e.target.value, "price", row)}
            />
          </Box>
        );
      },
    },
    {
      field: "discount",
      headerName: "ส่วนลด%",
      width: 200,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Box sx={{ m: 1 }}>
            <TextField
              type="number"
              value={row.discount}
              onChange={(e) => handleChangeVal(e.target.value, "discount", row)}
            />
          </Box>
        );
      },
    },
    {
      field: "vat",
      headerName: "VAT 7%",
      width: 200,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Box sx={{ m: 1 }}>
            <TextField
              type="number"
              InputProps={{
                readOnly: true,
              }}
              value={row.vat}
              onChange={(e) => handleChangeVal(e.target.value, "vat", row)}
            />
          </Box>
        );
      },
    },
    {
      field: "sum",
      headerName: "ยอดรวม",
      width: 200,
      renderCell: (params) => {
        const { row } = params;
        return (
          <Box sx={{ m: 1 }}>
            <TextField
              type="number"
              value={row.sum}
              onChange={(e) => handleChangeVal(e.target.value, "sum", row)}
            />
          </Box>
        );
      },
    },
  ];

  const onSubmit = async (formData) => {
    // console.log("formData =>", formData);
    setLoading(true);
    try {
      if (
        !formData.name ||
        !formData.address ||
        !formData.phone ||
        !formData.email
      ) {
        Swal.fire({
          icon: "error",
          title: "ข้อมูลไม่ครบถ้วน!",
          text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        });
        throw new Error("Please fill out all required fields.");
      }

      const dateFormat = dayjs(formData.date).toISOString();
      const payload = {
        ...formData,
        date: dateFormat,
        product: dataItems,
      };
      // console.log("payload =>", payload);
      if (id === "create") {
        await axios.post(`${import.meta.env.VITE_VERCEL_URL}`, payload);
        Swal.fire({
          icon: "success",
          title: "สร้างสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await axios.put(`${import.meta.env.VITE_VERCEL_URL}/${id}`, payload);
        Swal.fire({
          icon: "success",
          title: "อัพเดตสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setDataItems([]);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "An error occurred!",
        text: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem = [...dataItems];
    const obj = {
      id: newItem.length + 1,
      name: "",
      description: "",
      qty: 0,
      price: 0,
      discount: 0,
      vat: 0,
      sum: 0,
    };
    newItem.push(obj);
    setDataItems(newItem);
  };

  const handleChangeVal = (value, field, row) => {
    // console.log("value, field, row =>", value, field, row);
    const updatedItems = dataItems.map((item) => {
      // console.log("row.id =>", row.id);
      // console.log("item.id =>", item.id);
      if (row.id === item.id) {
        let price = parseFloat(item.price);
        let discount = parseFloat(item.discount);

        if (field === "price") {
          price = parseFloat(value);
        } else if (field === "discount") {
          discount = parseFloat(value);
        }

        const discountedPrice = price - (price * discount) / 100;
        const vat = discountedPrice * 0.07;
        const sum = discountedPrice + vat;

        return {
          ...item,
          [field]: value,
          sum: sum.toFixed(2),
          vat: vat.toFixed(2),
        };
      }
      return item;
    });

    // console.log("Updated Items =>", updatedItems);

    const totalPrice = updatedItems.reduce(
      (acc, item) => acc + parseFloat(item.price),
      0
    );
    const totalDiscount = updatedItems.reduce(
      (acc, item) => acc + parseFloat(item.discount),
      0
    );
    const totalVat = updatedItems.reduce(
      (acc, item) => acc + parseFloat(item.vat),
      0
    );
    const totalSum = updatedItems.reduce(
      (acc, item) => acc + parseFloat(item.sum),
      0
    );

    setSumPrice(totalPrice.toFixed(2));
    setSumDiscount(totalDiscount.toFixed(2));
    setSumVat(totalVat.toFixed(2));
    setSummary(totalSum.toFixed(2));
    setDataItems(updatedItems);
  };

  const handleRemoveItem = () => {
    const newItem = [...dataItems];
    newItem.splice(dataItems.length - 1, 1);
    setDataItems(newItem);
  };

  const getDetailById = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_VERCEL_URL}/${id}`);
      const { data } = res;
      formData.setValue("name", data.name);
      formData.setValue("address", data.address);
      formData.setValue("email", data.email);
      formData.setValue("phone", data.phone);
      const dateVal = dayjs(data.date);
      formData.setValue("date", dateVal);
      setDataItems(data.product);
      let totalPrice = data.product.reduce(
        (acc, item) => acc + parseFloat(item.price),
        0
      );
      let totalDiscount = data.product.reduce(
        (acc, item) => acc + parseFloat(item.discount),
        0
      );
      let totalVat = data.product.reduce(
        (acc, item) => acc + parseFloat(item.vat),
        0
      );
      let totalSum = data.product.reduce(
        (acc, item) => acc + parseFloat(item.sum),
        0
      );

      setSumPrice(totalPrice);
      setSumDiscount(totalDiscount);
      setSumVat(totalVat);
      setSummary(totalSum);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching data:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h5">
            {id === "create"
              ? "สร้างใบสั่งซื้อ"
              : `อัพเดทข้อมูลใบสั่งซื้อเลขที่ ${id}`}
          </Typography>
        </Stack>
        <FormProvider {...formData}>
          <form onSubmit={formData.handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <Controller
                    name="name"
                    control={formData.control}
                    render={({ field }) => (
                      <TextField
                        label="ชื่อร้านค้า/บริษัท/บุคคล"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <Controller
                    name="address"
                    control={formData.control}
                    render={({ field }) => (
                      <TextField
                        label="ที่อยู่"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <Controller
                    name="phone"
                    control={formData.control}
                    render={({ field }) => (
                      <TextField
                        label="เบอร์โทร"
                        value={field.value}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue.length <= 10) {
                            field.onChange(e);
                          }
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <Controller
                    name="email"
                    control={formData.control}
                    render={({ field }) => (
                      <TextField
                        label="อีเมล์"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <label>วันที่</label>
                  <Controller
                    name="date"
                    control={formData.control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        format="DD/MM/YYYY"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Stack direction="row" sx={{ mb: 3 }} spacing={2}>
              <Button
                color="success"
                variant="contained"
                startIcon={<Add />}
                sx={{ mr: 1 }}
                onClick={handleAddItem}
              >
                เพิ่มรายการ
              </Button>
              <Button
                color="error"
                variant="contained"
                startIcon={<Remove />}
                onClick={handleRemoveItem}
              >
                ลบรายการ
              </Button>
            </Stack>
            <Paper sx={{ height: "400px", mb: 3 }}>
              <DataGrid rows={dataItems} columns={columns} rowHeight={100} />
            </Paper>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <TextField label="หมายเหตุ" />
            </FormControl>
            <Typography variant="subtitle1">
              จำนวน: {dataItems.length}
            </Typography>
            <Typography variant="subtitle1">ราคา: {sumPrice}</Typography>
            <Typography variant="subtitle1">ส่วนลด: {sumDiscount}</Typography>
            <Typography variant="subtitle1">vat: {sumVat}</Typography>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", marginTop: 3 }}
            >
              ยอดรวม: {summary}
            </Typography>

            <Stack
              direction="row"
              alignItems="cener"
              justifyContent="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={() => {
                  navigate("/");
                }}
                style={{ fontSize: "1rem", padding: "7px 15px" }}
              >
                ย้อนกลับ
              </Button>
              <Button
                variant="contained"
                type="submit"
                startIcon={loading ? <CircularProgress size={24} /> : <Save />}
                disabled={loading}
              >
                บันทึก
              </Button>
            </Stack>
          </form>
        </FormProvider>
      </Box>
    </>
  );
};

export default Form;
