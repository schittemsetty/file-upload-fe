import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';

const Group = () => {

    const [colorsData, setColorsData] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [selectError, setSelectError] = useState(null);
    const [isUploadSuccess, setUploadBool] = useState(false);

    const getAllColors = () => {
        axios.get('http://localhost:8080/v1/auth/api/color/getAllColors', {
            headers: {
              'auth-token': sessionStorage.getItem('token')
            }
        }).then(response => {
            if (response && response.status === 200 && response.data) {
                setColorsData(response.data.body);
            }
        }).catch(error => {
            if (error.response.status >= 400) setSelectError(error.response.data.body);
            else setSelectError("Something went wrong. Please try again later.");
        });
    }

    useEffect(() => {
        setError(null);
        getAllColors();
    }, [])

    const handleChange = (e) => {
        const getSelectedColor = colorsData.filter(item => {
            if (e.target.value === item._id) {
                return item
            }
        });
        if (getSelectedColor && getSelectedColor.length) {
            setSelectedColor(getSelectedColor[0]);
        }
    }

    // On file select (from the pop up)
    const onFileChange = event => {
        // Update the state
        setError(null);
        setSelectedFile(event.target.files[0]);
    };

    // On file upload (click the upload button)
    const onFileUpload = () => {
        setError(null);
        setUploadBool(false);
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append("myFile", selectedFile, selectedFile.name);

        // Request made to the backend api
        // Send formData object
        axios.post('http://localhost:8080/api/uploadfile', formData,
        {
            headers: {
                'auth-token': sessionStorage.getItem('token')
            }
        }).then(response => {
            if (response && response.status === 200) {
                alert('File uploaded successfully');
                if (response.data && response.data.body && response.data.body.length) {
                    setUploadBool(true);
                    setSelectedColor('');
                    getAllColors();
                }
            }
        }).catch(error => {
            if (error && error.response && error.response.status >= 400) setError(error.response.data.body);
            else setError("Something went wrong. Please try again later.");
        })
    };

    const handleUpload = (bool) => {
        setUploadBool(bool);
    }

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px'}}>
                <div>
                    <input type="file" accept='.json' onChange={onFileChange}/>
                    <button onClick={onFileUpload}>
                        Upload!
                    </button>
                    <div style={{marginTop: '10px'}}><span style={{color: 'red'}}>{error}</span></div>
                </div>
                <div>
                    <span style={{margin: '10px'}}>Select a color:</span>{' '} 
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedColor ? selectedColor._id : ''}
                        onChange={handleChange}
                        style={{width: '150px'}}
                        >
                            {colorsData && colorsData.length ?
                                colorsData.map((item) => (
                                    <MenuItem value={item._id} key={item._id}>{item.color}</MenuItem>
                                )) : <MenuItem value="" key='none'>None</MenuItem>}
                    </Select>
                    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <FormHelperText style={{color: 'red'}}>{selectError}</FormHelperText>
                    </div>
                </div>
            </div>
            <Table selectedColor={selectedColor} isUpload={isUploadSuccess} handleUpload={handleUpload} />
        </div>
    )
}

export default Group;
