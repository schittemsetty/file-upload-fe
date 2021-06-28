import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const headCells = [
  { id: 'group', label: 'Group' },
  { id: 'user', label: 'User' },
  { id: 'color', label: 'Color' }
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableData, setTableData] = useState(null);
  const [error, setError] = useState(null);
  const selectedColor = (props && props.selectedColor && props && props.selectedColor.color) || '';
  const isUpload = props.isUpload;

  const getTableData = () => {
    let url = 'http://localhost:8080/v1/group/api/get?'
    url += 'color=' + selectedColor;
    url += '&from=' + (((page+1)*rowsPerPage) - rowsPerPage);
    url += '&size=' + rowsPerPage;
    axios.get(url, {
        headers: {
          'auth-token': sessionStorage.getItem('token')
        }
    }).then(response => {
        if (response && response.status === 200 && response.data) {
          setTableData(response.data.body);
          props.handleUpload(false);
        }
    }).catch(error => {
        console.log(error, 'error');
        if (error.response.status >= 400) setError(error.response.data.body);
        else setError("Something went wrong. Please try again later.");
    });
  }

  useEffect(() => {
    getTableData();
  }, []);

  useEffect(() => {
      getTableData();
  }, [page, rowsPerPage])

  useEffect(() => {
    if (isUpload || selectedColor) {
      setPage(0);
      getTableData();
    }
  }, [isUpload, selectedColor])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                  >
                      {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData && tableData.data && tableData.data.length ? tableData.data.map((row, index) => {
                  return (
                    <TableRow
                      key={row._id}
                    >
                      <TableCell>
                        {row.group}
                      </TableCell>
                      <TableCell>{row.user}</TableCell>
                      <TableCell>{row.color}</TableCell>
                    </TableRow>
                  );
                }) : null}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={(tableData && tableData.totalCount)||0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
