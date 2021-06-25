import axios from 'axios';
import React, {Component} from 'react';
import {Table, Col, Divider} from 'antd'
class Uploader extends Component {

  state = {

    // Initially, no file is selected
    selectedFile: null,
    fileData: null,
    columns: []
  };

  // On file select (from the pop up)
  onFileChange = event => {
    // Update the state
    this.setState({selectedFile: event.target.files[0]});

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(event.target.files[0], "UTF-8");
    reader.onload = (evt) => {
      /* Parse data */
      const jsonString = evt.target.result;
      let columns = Object.keys(JSON.parse(jsonString)[0]).map((prop, index)=>{
        return {
          title: prop.toUpperCase(),
          dataIndex: prop,
          key: index
        }
      })
      this.setState({columns, fileData: JSON.parse(jsonString)})
    };
  };

  // On file upload (click the upload button)
  onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("myFile", this.state.selectedFile, this.state.selectedFile.name);

    // Details of the uploaded file
    console.log(this.state.selectedFile);

    // Request made to the backend api
    // Send formData object
    axios.post("api/uploadfile", formData);
  };

  previewFile = () => {
    if (this.state.selectedFile && this.state.fileData) {
      return (<div>
        <Col span={16} offset={4} xs={{
            order: 1
          }} sm={{
            order: 2
          }} md={{
            order: 3
          }} lg={{
            order: 4
          }}>
          <h3>Preview File!</h3>
          <Table columns={this.state.columns} dataSource={this.state.fileData}/>
        </Col>
      </div>)
    }
  }

  render() {
    return (<div>
      <h3>
        File Upload using React!
      </h3>
      <div>
        <input type="file" accept='.json' onChange={this.onFileChange}/>
        <button onClick={this.onFileUpload}>
          Upload!
        </button>
      </div>
      <Divider/>
      {this.previewFile()}

    </div>);
  }
}

export default Uploader;
