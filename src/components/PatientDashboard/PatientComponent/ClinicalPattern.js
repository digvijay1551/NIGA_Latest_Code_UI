import React from 'react';
import {
    GetAllDiagnosis
} from "../../../store/actions/FindRubricsAction";
import { Link } from 'react-router-dom';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import engs from '../../../assets/eng.png'
import mart from '../../../assets/mar.png'
import {
    Card,
    TabPane,
    CardBody,
    CardHeader,
    Col,
    Row,
    Table,
    Input,
    FormGroup,
    Label,
    CardText,
    Button,
    Alert

} from 'reactstrap';
import { ClipLoader } from 'react-spinners';
import AsyncPaginate from "react-select-async-paginate";
import CommonServices from '../../../Services/CommonServices';
import { connect } from "react-redux";
import ReactHtmlParser from 'react-html-parser';
import { green } from '@mui/material/colors';
import { getIntensities } from "../../../store/actions/IntensityAction"
// import {
//     addRubrics,deleteRubrics
// } from "../../../store/actions/FindRubricsAction";
import {
    getSections,
    getBodyPartsBySection,
    getSubSectionsByBodyPart,
    searchSubSections,
    addRubrics,
    getRemedyCounts,
    getRemedyName
} from "../../../store/actions/FindRubricsAction";
import {
    enqueueSnackbar as enqueueSnackbarAction,
    closeSnackbar
} from '../../../store/actions/notification';


class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            diagnosisSystemList:[],
            toggleOrderModel: false,
            allopathicMedicines: "",
            diagnosisID: 0,
            diagnosisName: "",
            diagnosisNameAlias: "",
            diagnosisRemediesModels: [],
            RubricByKeywordID: [],
            examiniations: "",
            investigations: "",
            miasm: "",
            therapeutics: "",
            SelectedRubricForPopUp: '',
            KeywordArray: [],
            isloding: false,
            specificKeywordId: 0,
            RubricByKeywordIDforpopup: [],
            RemedyAndAuthor: [],
            islodingRemedy:false,
            RemedyCountsList: {},
            TabItem: [
                {
                    value: 1,
                    label: "Symptoms",
                },
                {
                    value: 2,
                    label: "Causations",
                },
                {
                    value: 3,
                    label: "Pathology",
                },
                {
                    value: 4,
                    label: "Characteristics",
                },
                // {
                //     value: 5,
                //     label: "Systems",
                // },
                {
                    value: 6,
                    label: "Emergencies",
                },
                {
                    value: 7,
                    label: "Onset/Duration/Progress",
                },
                {
                    value: 8,
                    label: "Patterns",
                },
                {
                    value: 9,
                    label: "Location/Extention",
                },
                {
                    value: 10,
                    label: "Sensation",
                },
                {
                    value: 11,
                    label: "Modalities",
                },
                {
                    value: 12,
                    label: "Accompanied",
                },
                {
                    value: 13,
                    label: "Observations",
                },
                {
                    value: 14,
                    label: "Before/After/During",
                    color: "black",
                },
            ],
            GetDiagnosisForClinicalPattern: [],
            DiagnosisIds: [],
            RubricNameForPopUp:'',
        RemedyDtailsList: [],
        remedyCount: 0,
        marathiArray:[],
        englishArray:[],
        referencerubric:[]
        }

    }

    componentDidMount() {
        debugger
        this.GetDiagnosisForClinicalPattern()
    }
    

    GetDiagnosisForClinicalPattern() {
        CommonServices.getData(`/diagnosis/GetDiagnosisForClinicalPattern`).then((temp) => {
            this.setState({
                GetDiagnosisForClinicalPattern: temp
            })
        })
    }

    loadDiagnosisListOptions = async (search, prevOptions) => {
        const options = [];
        // var subsectionList 
        // await this.GetParentSubsections(this.state.sectionId).then((result) => {
        //     subsectionList = result;
        // })
        this.state.GetDiagnosisForClinicalPattern.map(x => options.push({ value: x.diagnosisID, label: x.diagnosisName }));
        let filteredOptions;
        if (!search) {
            filteredOptions = options;
        } else {
            const searchLower = search.toLowerCase();

            filteredOptions = options.filter(({ label }) =>
                label.toLowerCase().includes(searchLower)
            );
        }

        const hasMore = filteredOptions.length > prevOptions.length + 10;
        const slicedOptions = filteredOptions.slice(
            prevOptions.length,
            prevOptions.length + 10
        );
        return {
            options: slicedOptions,
            hasMore
        };
    }

    DiagnosisChanged(e) {
        debugger
        this.setState({
            allopathicMedicines: '',
            diagnosisID: 0,
            diagnosisName: '',
            diagnosisNameAlias: '',
            diagnosisRemediesModels: [],
            examiniations: 'res.data.examiniations',
            investigations:'',
            miasm: '',
            therapeutics:{}
        })
        console.log("e====", e)
        if (e != null) {
            this.setState({
                DiagnosisIds: e,
               
            }, () => {
            })
        }
        debugger
        if(e!==null)
        {
            CommonServices.postData({}, `/diagnosis/DiagnosisSearch?diagnosisID=` + e.value).then((res) => {
                debugger
                console.log('API res=== OnClinicalPattern', res)
                if (res.data !== undefined) {
                    this.setState({
                        allopathicMedicines: res.data.allopathicMedicines,
                        diagnosisID: res.data.diagnosisID,
                        diagnosisSystemList:res.data.diagnosisSystemList,
                        diagnosisName: res.data.diagnosisName,
                        diagnosisNameAlias: res.data.diagnosisNameAlias,
                        diagnosisRemediesModels: res.data.diagnosisRemediesModels,
                        examiniations: res.data.examiniations,
                        investigations: res.data.investigations,
                        miasm: res.data.miasm,
                    })
                    CommonServices.postData({}, `/diagnosis/GetThrepoticByDiagonisID?diagnosisId=` + res.data.diagnosisID).then((res) => {
                        debugger
                        console.log('API GetThrepoticByDiagonisID===', res.data)
                        if (res.data !== undefined) {
                            this.setState({
                                therapeutics: res.data.diagnosisTherapeutics
                            })
                        }
                        else {
    
                        }
                    });
                }
                else {
    
                }
            });
        }
        else{

        }
       


    }



    TabKeywordById = (String) => {
        debugger
        console.log('String==', String)

        if (String !== undefined) {
            let requesttype = String === "Characteristics" ? "Monogram" : String
            CommonServices.postData({}, `/diagnosis/GetDiagnosisKeywordByTab?diagnosisId=` + this.state.diagnosisID + `&tabType=` + requesttype).then((res) => {
                debugger
                console.log('API res===', res.data)
                if (res.data !== undefined) {
                    this.setState({
                        KeywordArray: res.data,
                        diagnosisRemediesModels: [],
                        RubricByKeywordID: [],
                        KeywordString: String
                    })
                }
                else {

                }
            });
        }
    }

    // handleChange = (e) => {
    //     debugger
    //     console.log('res===', e.target.value)
    //     this.setState({ [e.target.name]: e.target.value });
    //     if (e.target.value !== undefined) {
    //         CommonServices.postData({}, `/diagnosis/DiagnosisSearch?diagnosisID=1` + e.target.value).then((res) => {
    //             debugger
    //             console.log('API res===', res.data)
    //             if (res.data !== undefined) {
    //                 this.setState({
    //                     allopathicMedicines: res.data.allopathicMedicines,
    //                     diagnosisID: res.data.diagnosisID,
    //                     diagnosisName: res.data.diagnosisName,
    //                     diagnosisNameAlias: res.data.diagnosisNameAlias,
    //                     diagnosisRemediesModels: res.data.diagnosisRemediesModels,
    //                     examiniations: res.data.examiniations,
    //                     investigations: res.data.investigations,
    //                     miasm: res.data.miasm,
    //                     therapeutics: res.data.therapeutics
    //                 })
    //             }
    //             else {

    //             }
    //         });
    //     }
    // }

    KeyWordClikToRubric = (Id) => {
        debugger
        this.setState({
            isloding: true,
            specificKeywordId: Id
        })
        console.log('KeyWordId==', Id)
        console.log('KeyWordString==', this.state.KeywordString)
        if (Id !== undefined) {
            CommonServices.postData({}, `/diagnosis/GetRubricByKeywordID?keywordID=` + Id + `&tabType=` + this.state.KeywordString).then((res) => {
                debugger
                console.log('KeyWordClikToRubric===', res.data)
                if (res.data !== undefined) {
                    this.setState({
                        RubricByKeywordID: res.data,
                        isloding: false,

                    })
                }
                else {

                }
            });
        }
    }

    render() {
        return (
            <TabPane tabId={2}>
                <Row>
                    <Col sm="12" md="12">
                        <FormGroup row className="mb-2">
                            <Col sm="12" md="3">
                                {/* <Input type="text"
                                    placeholder="Diagnosis Or Condition Search..."
                                    name='searchText'
                                    value={this.state.searchText}
                                    onChange={this.handleChange.bind(this)}
                                /> */}

                                <AsyncPaginate isClearable
                                    labelKey="value"
                                    labelValue="DiagnosisId"
                                    placeholder="Type Diagnosis Name"
                                    value={this.state.DiagnosisIds}
                                    loadOptions={this.loadDiagnosisListOptions}
                                    onChange={this.DiagnosisChanged.bind(this)}
                                />

                            </Col>
                            <Col sm="12" md="7" className="txtleft mt-1">
                                <span style={{fontWeight: 500}}> {this.state.diagnosisName} </span>- <span>{this.state.diagnosisNameAlias}</span>
                            </Col>
                            <Col sm="12" md="2" className="txtright mt-1">
                                <span> <b> {this.state.miasm}</b> </span>
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm="12" md="12">
                        <Card>
                            <CardHeader className="p-1 mt-1">
                                <CardText>
                                        {
                                            this.state.TabItem.map((r, index) => {
                                                return <span class="" key={index} >
                                                    <Button size="sm" className="btntab" color="primary" onClick={() => {
                                                                this.TabKeywordById(r.label)
                                                            }}>
                                                    {/* <span size="sm" className=""
                                                            style={{ color: r.color }}
                                                            
                                                        > */}
                                                            {r.label}
                                                    {/* </span> */}
                                                    </Button>
                                                </span>
                                            })
                                        }
                                </CardText>
                            </CardHeader>
                            <CardBody className="pt-1">
                                <Row>
                                    <Col sm="12" md="5" style={{ padding: 0 }}>
                                        <div responsive="true" className="divst1">
                                            <span class="hthead1">KEYWORDS : </span><br />
                                                <span class="divdet">
                                                    {
                                                        this.state.KeywordArray.map((r, index) => {
                                                            return <span class="rubric" key={index} >
                                                                <span>
                                                                    <label
                                                                        size="sm" className="m-1 lbls"
                                                                        onClick={() => {
                                                                            this.KeyWordClikToRubric(r.keywordId)
                                                                        }}
                                                                    >{r.keyword},</label>

                                                                </span>
                                                            </span>
                                                        })
                                                    }
                                                </span>
                                        </div>
                                        <div responsive="true" className="divst1 mt-2" style={{ overflowY: 'scroll', maxHeight: '485px' }}>
                                            <span class="hthead1">RUBRICS WITH REMEDIES : </span><br />
                                            <span class="divdet">
                                                <div class="table-responsive">
                                                    <table class="table table-hover">
                                                        {this.state.diagnosisRemediesModels.length > 0 ?
                                                            <tbody style={{ width: '100%', display: 'inline-table'}}>
                                                                {

                                                                    this.state.diagnosisRemediesModels.map((r, index) => {
                                        const { Intensities } = this.props.intensity;

                                                                        return <tr class="rubric" key={index} >
                                                                            <td><span
                                                                                onClick={() => {
                                                                                    this.toggleOrderModal(); // Calling the first method
                                                                                    this.popup(r);   // Calling the second method
                                                                                }}
                                                                            >{r.subSectionName}</span>
                                                                                {/* <button class="btn-clipboard" id="10">0</button>
                                                                                <button class="btn-clipboard" id="11">1</button>
                                                                                <button class="btn-clipboard" id="12">2</button>
                                                                                <button class="btn-clipboard" id="13">3</button>
                                                                                <button class="btn-clipboard" id="14">4</button> */}

                                                                                {Intensities.map((intensity, index) => {
                                                                                    let id = `${r.subSectionId}${intensity.intensityNo}`;
                                                                                    return (
                                                                                        <button
                                                                                            className="btn-clipboard1"
                                                                                            id={`${r.subSectionId}${r.intensityNo}`}
                                                                                            style={{ backgroundColor: green }}
                                                                                            // onClick={() => this.updateIntensity(rubric.subSectionId, intensity.intensityNo)}
                                                                                            onClick={() => this.selectRubrics(r, intensity.intensityNo, id)}
                                                                                        >
                                                                                            {intensity.intensityNo}
                                                                                        </button>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    })
                                                                }
                                                            </tbody>
                                                            :
                                                            <span>
                                                                {this.state.isloding === false ?
                                                                    <tbody style={{ width: '100%', display: 'inline-table'}}>
                                                                        {
                                                                            this.state.RubricByKeywordID.map((r, index) => {
                                                                                return <tr class="rubric" key={index} >
                                                                                    <td>
                                                                                        <span
                                                                                            onClick={() => {
                                                                                                this.toggleOrderModal(); // Calling the first method
                                                                                                this.popup(r);   // Calling the second method
                                                                                            }}
                                                                                        >{r.subSectionName}</span>
                                                                                        <button class="btn-clipboard" id="10">0</button>
                                                                                        <button class="btn-clipboard" id="11">1</button>
                                                                                        <button class="btn-clipboard" id="12">2</button>
                                                                                        <button class="btn-clipboard" id="13">3</button>
                                                                                        <button class="btn-clipboard" id="14">4</button>
                                                                                    </td>
                                                                                </tr>
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                    :
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',

                                                                    }}>
                                                                        <ClipLoader
                                                                            color="#2d292a"
                                                                            size={80}
                                                                        />
                                                                    </div>
                                                                }
                                                            </span>
                                                        }
                                                    </table>
                                                    <Modal size="lg" isOpen={this.state.toggleOrderModel} toggle={this.toggleOrderModal.bind(this)} >                                
                                                <ModalBody>
                                                    {/* <Row>
                                                        <Col md="12">
                                                            {this.state.RemedyAndAuthor.map((item, index) => {
                                                                return (
                                                                    <span key={index}>
                                                                        <span
                                                                            style={{
                                                                                fontFamily: item.fontName,
                                                                                color: item.fontColor,
                                                                                fontStyle: item.fontStyle,
                                                                            }}
                                                                            to="#">
                                                                            <span>
                                                                                {item.remedyAlias}, &nbsp;</span> </span>
                                                                    </span>
                                                                )
                                                            })}
                                                        </Col>
                                                    </Row> */}
                                               
                    
                      

                                                    <div responsive="true" >
                                                        <Row>
                                                            <Col md="12" className="txtright">

                                                                <div>
                                                                    <span className="auth"
                                                                    onClick={() => this.ToggleAuthorAlias()}
                                                                    ><i class="fa fa-user" aria-hidden="true"></i></span>
                                                                </div>

                                                                <div class="hover-text1"><span className=""><img src={engs} className="langicon" alt="English" /></span>
                                                                    <span class="tooltip-text1 bottom">
                                                                        <div class="">
                                                                        {
                                                        this.state.englishArray.length > 0 ?
                                                        this.state.englishArray.map((c, index) => {
                                                        return <tr key={index}>
                                                            <td>{c.subSectionDetails}</td>
                                                        </tr>
                                                        }) :
                                                        <tr>
                                                            <td colSpan="4">No data to display</td>
                                                        </tr>}
                                                                        </div>
                                                                    </span>
                                                                </div>

                                                                <div class="hover-text2"><span className=""><img src={mart} className="langicon" alt="Marathi" /></span>
                                                                    <span class="tooltip-text2 bottom">
                                                                        <div class="">
                                                                        {
                                                        this.state.marathiArray.length > 0 ?
                                                        this.state.marathiArray.map((c, index) => {
                                                            return <tr key={index}>
                                                                <td>{c.subSectionDetails}</td>
                                                            </tr>
                                                        }) :
                                                        <tr>
                                                            <td colSpan="4">No data to display</td>
                                                        </tr>}
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row style={{ padding: '6px' }}>
                                                            <Col md="12" className="txtleft">
                                                                <strong className="h6">{this.state.RubricNameForPopUp}</strong>
                                                                <hr></hr>
                                                                <strong className="h6">
                                                                    {
                                                                        this.state.referencerubric.length > 0 ?
                                                                            this.state.referencerubric.map((c, index) => {
                                                                                return <a href='#' className="crref"><tr key={index}>
                                                                                    <td >{c.refSubSectionName}</td>
                                                                                </tr></a>
                                                                            }) :
                                                                            <tr>
                                                                                <td colSpan="4">No data to display</td>
                                                                            </tr>
                                                                    }</strong>
                                                                <hr></hr>
                                                                <strong className="h6">Remedy Count : ({this.state.remedyCount}) </strong>
                                                                <hr></hr>
                                                                {this.state.RemedyDtailsList.length > 0 ?
                                                                    <div>
                                                                        {this.state.RemedyDtailsList?.map((item, index) => {
                                                                            {/* <Link to={"/PatientDashboard/" + this.props.patientId + "/" + this.props.caseId + "/" + this.props.patientAppId + "/" + this.props.doctorId} */ }
                                                                            const NewTab = 5
                                                                            return (
                                                                                <span key={index} style={{display: 'inline-block'}} class="remhov">
                                                                                    {/* { */}
                                                                                    {/* item.remediesModels.map((author, index) => {
                                                                                                return  */}
                                                                                    {/* <span > */}
                                                                                    {/* <Link to={`/PatientDashboard/${this.props.patientId}/${this.props.caseId}/${this.props.patientAppId}/${this.props.doctorId}/${NewTab}`} */}
                                                                                    <Link to={`#`}
                                                                                        style={{
                                                                                            // fontFamily: item.fontName,
                                                                                            color: item.fontColor,
                                                                                            fontStyle: item.fontStyle,
                                                                                            textDecoration : 'none',
                                                                                            cursor: 'pointer',
                                                                                        }}>
                                                                                        <span onClick={() => this.handlePopuptoMM(item.remedyId)}>
                                                                                            {/* {item.remedyAlias} */}
                                                                                            {item.fontColor === 'Red'
                                                                                                ? item.remedyAlias.toUpperCase()
                                                                                                : item.remedyAlias}
                                                                                            {this.state.ShowAuthorAlias && `(${item.authorAlias}),`}</span>
                                                                                    </Link>
                                                                                    {/* </span> */}
                                                                                    {/* }) */}
                                                                                    {/* } */}
                                                                                </span>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                    : <div >
                                                                        <span >Data Not Found</span>
                                                                    </div>
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </div>

                    
              
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="danger" onClick={this.toggleOrderModal.bind(this)}><i className="fa fa-ban"></i> Cancel</Button>
                                                </ModalFooter>
                                            </Modal>

                                                </div>
                                            </span>
                                        </div>
                                    </Col>
                                    <Col sm="12" md="7" style={{ padding: 0 }}>
                                    <div responsive="true" className="divst2" style={{ overflowY: 'scroll', }}>
                                            {/* <span class="hthead1">DETAILS : </span><br /> */}
                                            <span class="">

                                            <table style={{width:'100%'}} className='table-bordered'>
                                                    <tr>
                                                        <td style={{width:'25%'}} className='text-center'><span class="hthead1" size="sm" style={{ color: '#5682b0', lineHeight : 2 }}>INVESTIGATION</span></td>
                                                        <td style={{width:'25%'}} className='text-center'><span class="hthead1" size="sm" style={{ color: '#849270', lineHeight : 2 }}>ALLOPATHIC RX</span></td>
                                                        <td style={{width:'25%'}} className='text-center'><span class="hthead1" size="sm" style={{ color: '#f2c54f', lineHeight : 2 }}>EXAMINATION</span></td>
                                                        <td style={{width:'25%'}} className='text-center'><span class="hthead1" size="sm" style={{ color: '#f2374f', lineHeight : 2 }}>SYSTEMS</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td className='p-2'>{this.state.investigations}</td>
                                                        <td className='p-2'>{this.state.allopathicMedicines}</td>
                                                        <td className='p-2'>{this.state.examiniations}</td>
                                                        <span>
                                                        {
                                                            this.state.diagnosisSystemList.map((s, index) => {
                                                             return <span key={index}>
                                                        
                                                        <td className='p-2'>{s.diagnosisSystemName}</td>
                                                                </span>
                                                            })
                                                        }
                                                        </span>
                                                    </tr>
                                                </table>

                                                {/* <table>
                                                    <tr>
                                                        <td><span size="sm" style={{ color: '#5682b0' }}>INVESTIGATION</span></td>
                                                        <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                                        <td>{this.state.investigations}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><span size="sm" style={{ color: '#849270' }}>ALLOPATHIC RX</span></td>
                                                        <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                                        <td>{this.state.allopathicMedicines}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><span size="sm" style={{ color: '#f2c54f' }}>EXAMINATION</span></td>
                                                        <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                                        <td>{this.state.examiniations}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><span size="sm" style={{ color: '#f2c54f' }}>SYSTEMS</span></td>
                                                        <td>&nbsp;&nbsp;:&nbsp;&nbsp;</td>
                                                        <td>{this.state.examiniations}</td>
                                                    </tr>
                                                </table> */}

                                            </span>
                                           
                                        </div>
                                        <div responsive="true" className="divst2 mt-2" style={{ overflowY: 'scroll', height: '420px' }}>
                                            <span class="hthead1">THERAPEUTICS : </span><br />
                                            <span class="divdet">{ReactHtmlParser(this.state.therapeutics)}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>

                </Row>

            </TabPane>
        )
    }

    popup = (item) => {
        debugger
        this.state.RubricNameForPopUp=''
        this.state.RemedyDtailsList= []
        this.state.remedyCount= 0
        this.state.marathiArray=[]
        this.state.englishArray=[]
        this.state.referencerubric=[]

        CommonServices.getDataById(parseInt(item.subSectionId), `/RubricRemedy/GetRubricDetails`).then((temp) => {
            console.log("rubric details t===",temp)
            temp.subSectionLanguageDetails.forEach((item) => {
                if (item.languageName.trim() === "English") {
                    this.state.englishArray.push(item);
                } else if (item.languageName.trim() === "Marathi") {
                    this.state.marathiArray.push(item);
                }
            });
            this.setState({
                // isloding: true,
                RemedyDtailsList: temp.remediesList,
                remedyCount: temp.remdeyCount,
                referencerubric: temp.referencerubric,
                RubricNameForPopUp: temp.subSectionName
            })
        });
    }


    toggleOrderModal = () => {
        this.setState({
            toggleOrderModel: !this.state.toggleOrderModel,

        })
    };

    ////
    selectRubrics = async (rubric, intensity, id) => {
        debugger
        const remedyCount = await this.props.getRemedyCounts(rubric.subSectionId);

        const { selectedRubrics } = this.props.state;//subSectionId
        console.log('selectedRubricscount====', this.props.state)
        // const isExist = selectedRubrics.indexOf(rubric)
        const isExist = selectedRubrics.findIndex((item) => item.subSectionId === rubric.subSectionId && item.subSectionId === rubric.subSectionId);

        rubric.intensity = intensity;
        rubric.remedyCountForSort = remedyCount.remedyCount;
        // rubric.remedyName = remedyName;

        if (isExist === -1) {
            const { remedyCount } = this.props.state;
            rubric.remedyCount = remedyCount;
           // this.props.addRubrics(rubric)
           if(this.props.state.selectedRubrics?.length<20)
           {
           this.props.addRubrics(rubric)
           }
           else{
           this.props.enqueueSnackbarAction("Whoops! You've hit the max limit of 20 rubrics.", "warning");
           }
        }
        else{
            this.props.enqueueSnackbarAction("This rubric is already added for Repertorization", "warning");
        }
    }
    ////
    handlePopuptoMM = (remedyId) => {
        this.toggleOrderModal()
        this.props.updatePassedId(5, remedyId);
    };
    ToggleAuthorAlias() {
        this.setState((prevState) => ({
            ShowAuthorAlias: !prevState.ShowAuthorAlias
        }));
    }

}
const mapStateToProps = (state) => ({
    DiagnosisList: state.rubrics.Diagnosis,
    intensity: state.intensity,
    state: state.rubrics,
});

const mapDispatchToProps = {
    GetAllDiagnosis,
    getIntensities,
    addRubrics,
    getRemedyCounts,
    enqueueSnackbarAction
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent)