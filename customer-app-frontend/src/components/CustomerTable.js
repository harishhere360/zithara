import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';

const CustomerTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    fetchData(1); // Fetch data for the first page when component mounts
  }, []);

  const fetchData = async (page, searchValue) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customers`, {
        params: { page, limit: 20, search: searchValue } // Send search value to backend
      });
      
      const { rows, total } = response.data; // Assuming the API returns { rows: [], total: 50 }

      setData(rows);
      setPages(Math.ceil(total / 20)); // Use total from response
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Ensure loading state is set to false even on error
    }
  };

  const columns = [
    { Header: 'Sno', accessor: 'sno' },
    { Header: 'Customer Name', accessor: 'customer_name' },
    { Header: 'Age', accessor: 'age' },
    { Header: 'Phone', accessor: 'phone' },
    { Header: 'Location', accessor: 'location' },
    { Header: 'Date', accessor: 'created_at', Cell: row => row.original.created_at.split('T')[0] },
    { Header: 'Time', accessor: 'created_at', Cell: row => row.original.created_at.split('T')[1].slice(0, -1) },
  ];

  const handlePageChange = (pageNumber) => {
    fetchData(pageNumber);
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    fetchData(1, searchValue); // Fetch data with search value
  };

  return (
    <div>
      <h2>Customer Records</h2>
      <input
        type="text"
        placeholder="Search by name or location"
        onChange={handleSearch}
        style={{ marginBottom: '10px' }}
      />
      <ReactTable
        data={data}
        columns={columns}
        loading={loading}
        pageSize={20}
        pages={pages}
        manual // Tell React Table that we'll handle pagination
        onFetchData={(state) => {
          // This function is called when the table needs new data due to pagination or sorting
          fetchData(state.page + 1); // Note: React Table pages are zero-based
        }}
        onPageChange={(pageNumber) => handlePageChange(pageNumber)}
        filterable
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
        }
      />
    </div>
  );
};

export default CustomerTable;
