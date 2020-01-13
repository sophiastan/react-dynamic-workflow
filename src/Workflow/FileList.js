import React, { Component } from 'react';

// Component for managing a list of uploaded files or library documents.
class FileList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            fileInfos: props.fileInfos ? props.fileInfos : []
        };
    }

    componentDidMount() {
        const list = this.state.fileInfos.map((item, i) => {
            if (item.workflowLibraryDocumentSelectorList) {
                const fileData = {
                    "name": item.name,
                    "workflowLibraryDocumentId": item.workflowLibraryDocumentSelectorList[i].workflowLibDoc
                }
                return fileData;
            }
            else {
                const transientData = {
                    "name": item.name,
                    "transientDocumentId": ""
                }
                return transientData;
            }
        });

        this.state.setParentState({
            fileInfos: list
        });
    }

    onFileUpload = async (event, index) => {
        const file = event.target.files[0];
        const transientDocument = await this.state.getParentState().signService.postTransient(file);
        const transientDocumentId = transientDocument.transientDocumentId;

        // Update file item - local state
        this.setState(state => {
            const list = this.state.fileInfos.map((item, i) => {
                if (i === index) {
                    item.file = file;
                    return item;
                }
                else {
                    return item;
                }
            });

            return {
                fileInfos: list
            }
        });

        // Update upload file info - parent state
        this.state.setParentState(state => {
            const list = this.state.getParentState().fileInfos.map((item, i) => {
                if (i === index) {
                    if (item.workflowLibraryDocumentSelectorList) {
                        const fileData = {
                            "name": item.name,
                            "workflowLibraryDocumentId": item.workflowLibraryDocumentSelectorList[i].workflowLibDoc
                        }
                        return fileData;
                    }
                    else {
                        const transientData = {
                            "name": item.name,
                            "transientDocumentId": transientDocumentId
                        }
                        return transientData;
                    }
                }
                else {
                    return item;
                }
            });

            return {
                fileInfos: list
            }
        });
    }

    render() {
        return (
            <div>
                <div id="upload_header">
                    <h3 id="upload_header_label" className="recipient_label">Files</h3>
                </div>
                <div id="upload_body">
                    {
                        this.state.fileInfos.map((item, index) =>
                            <div className="file_info_div row" id={`file_info_${item.name}`} key={index}>
                                <div className="col-lg-4">
                                    <h3>{item.label}</h3>
                                </div>
                                <div className="col-lg-8">
                                    <div className="custom-file" id={`upload_${item.name}`}>
                                        {item.workflowLibraryDocumentSelectorList ?
                                            <div>
                                                <h4>
                                                    {item.workflowLibraryDocumentSelectorList[0].label}
                                                </h4>
                                            </div> :
                                            <div>
                                                <input type="file" className="custom-file-input"
                                                    id={`logo_${item.name}`} onChange={(event) => this.onFileUpload(event, index)}></input>
                                                <h4 className="custom-file-label text-truncate">
                                                    {item.file ? item.file.name : "Please Upload A File"}</h4>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default FileList;