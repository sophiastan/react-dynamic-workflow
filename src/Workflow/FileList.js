import React, { Component } from 'react';

import SignService from '../Services/SignService';

// Component for managing a list of carbon copy groups
class FileList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            setParentState: props.setParentState,
            getParentState: props.getParentState,
            signService: new SignService()
        };
    }

    onFileUpload = async (event, index) => {
        const file = event.target.files[0];
        const transientDocument = await this.state.signService.postTransient(file);
        const transientDocumentId = transientDocument.transientDocumentId;

        this.state.setParentState(state => {
            const list = this.state.getParentState().file_infos.map((item, i) => {
                // console.log("workflowLibDoc: ");
                // console.log(item.workflowLibraryDocumentSelectorList[i].workflowLibDoc);
                if (i === index) {
                    const transientData = {
                        "name": item.name,
                        "transientDocumentId": transientDocumentId
                    }
                    return transientData;
                }
                else {
                    return item;
                }

                // if (i === index) {
                //     if (item.workflowLibraryDocumentSelectorList !== "") {
                //         const fileData = {
                //             "name": item.name,
                //             "workflowLibraryDocumentId": item.workflowLibraryDocumentSelectorList[i].workflowLibDoc
                //         }
                //         return fileData;
                //     }
                //     else {
                //         const fileData = {
                //             "name": item.name,
                //             "transientDocumentId": transientDocumentId
                //         } 
                //         return fileData;
                //     }
                // }
                // else {
                //     return item;
                // }
            });

            return {
                file_infos: list

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
                         this.state.getParentState().file_infos.map((item, index) =>
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