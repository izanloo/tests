import  React,{useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Button from '@mui/material/Button';
import { RiDeleteBin5Fill } from "react-icons/ri";  
// import Styles  from "./tabel.module.css";
import axios from 'axios';
// import ModalEdit from "../../Components/Modal/ModalEdit"
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, display:"flex", justifyContent:"space-between"}}>
      <IconButton
      
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
     
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

// TablePaginationActions.propTypes = {
//   count: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
//   page: PropTypes.number.isRequired,
//   rowsPerPage: PropTypes.number.isRequired,
// };

// function createData(name, calories, fat) {
//   return { name, calories, fat };
// }

export default function CustomPaginationActionsTable(props) {
  let rows= props.row
  let rowCat=props.rowCat
  let setRow=props.setRow
  let setRowCat=props.setRowCat

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
 async function Handledelete(id) {
   try{
    await axios.delete(`http://localhost:3002/products/${id}`)
    const products = await axios.get("http://localhost:3002/products");
      const category = await axios.get("http://localhost:3002/category");
     setRow(products.data);
      setRowCat(category.data);
   } 
  catch(error){
       console.log(error);
  }
}


  return (
    <TableContainer component={Paper}  sx={{direction:'rtl',mr:20,width:"60vw",height:"60vh"}} >
      <Table  aria-label="custom pagination table">
        <TableBody sx={{direction:'rtl' }}>
        <TableRow key={1}>
        <TableCell style={{ width: 40 }} align="right">
                   تصویر
              </TableCell>
              <TableCell style={{ width: 40 }} component="th" scope="row" align="right">
              نام کالا
              </TableCell>
              <TableCell style={{ width: 40 }} align="right">
              دسته بندی
                            </TableCell>
              <TableCell style={{ width: 40 }} align="right">
              
              </TableCell>
            </TableRow>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell style={{ width: 40 }} align="right">
              <img src={`http://localhost:3002/files/${row.thumbnail}`} /> 
              </TableCell>
              <TableCell style={{ width: 40 }} component="th" scope="row" align="right">
                {row.name }
              </TableCell>
              <TableCell style={{ width: 40 }} align="right">
                {rowCat.find(itemCat=> itemCat.id==row.category).name}
              </TableCell>
              <TableCell style={{ width: 40 }} align="right">
              <Button sx={{ml:1}} > <span id={row.id}></span> </Button> 
               <Button sx={{mr:1}}  onClick={()=>Handledelete(row.id)}><RiDeleteBin5Fill/> </Button> 
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 45 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter >
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
                
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
