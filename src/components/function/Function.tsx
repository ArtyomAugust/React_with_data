/* eslint-disable no-loop-func */
import "./Function.css";
import { useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {Container, Row, Col, DropdownButton, Dropdown, Form, Button}from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import dayjs, { Dayjs } from 'dayjs';
import { AgChartsReact } from 'ag-charts-react';
import { AgChartOptions, AgCharts } from 'ag-charts-community';
import {useFetch} from "../hooks/useFetch";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const Function = () => {
    const { data} = useFetch("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/");
    const [selectValue, setSelect] = useState("Все страны");
    const [ctrieValue, setCtries] = useState([]);
    const [vStart, setStart] = useState<Dayjs | null>(dayjs('2019-12-31'));
    const [vEnd, setEnd] = useState<Dayjs | null>(dayjs('2020-12-14'));
    const [vResBtn, setResBtn] = useState(false);
    const minDate = dayjs("2019-12-31");
    const maxDate = dayjs('2020-12-14');

    useEffect(() => {
        
        resetTimeBool(vStart, vEnd);        
        
    }, [vStart, vEnd]);

    useEffect(()=>{

        makeCntries(data);

    }, [data])

    const makeCntries = (dataSer: any) => {
        if (dataSer !== undefined) {

            let cntryAll = dataSer.records.map((item: any) => {
                return item.countriesAndTerritories;
            }).filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            setCtries(cntryAll);
            cntryAll.unshift('Все страны');
        }
    }

    const AllCntry = (data: any) => {
        
        if (data !== undefined) {
            
            let count = 0;
            const result = data.map((item: any): any => {
                return <option key={count++} value={item}>{item}</option>;
            });
            return (
                <Form.Select className="mt-5 m-auto w-50 border border-danger-subtle" onChange={(event) => handleSelect(event)}>
                    {result}
                </Form.Select>
            );
        }
    };

    const handleSelect = (event: any) => {
        setSelect(event.target.value);
    }

    const resetTimeBool = (vStart: any, vEnd: any) => {
        if (vStart.format('DD/MM/YYYY') !== dayjs('2019-12-31').format('DD/MM/YYYY') || vEnd.format('DD/MM/YYYY') !== dayjs('2020-12-14').format('DD/MM/YYYY')) {
            setResBtn(true);
        }
    }
    const resetTime = () => {
        setStart(dayjs("2019-12-31"));
        setEnd(dayjs('2020-12-14'));
    }
    const MakeButtonRes = () => {
        return <Button variant="outline-warning" onClick={() => {resetTime(); setResBtn(false)}}>Отобразить все данные</Button>;
    }

    const makeFunction = (dataSer: any, vStart: any, vEnd: any, select: string | "", ctrieValue: any[]) => {
        
        let countCases: number = 0;
        let countDeaths: number = 0;
        let cntryAll = ctrieValue; 
        let arrayData: any = [];


        if (dataSer !== undefined) {

            const dateReg = dataSer.records.filter((item:any): any => {
                const [day, month, year] = item.dateRep.split('/');
                return dayjs(`${year}-${month}-${day}`).isBetween(`${vStart.format('YYYY-MM-DD')}`, `${vEnd.format('YYYY-MM-DD')}`, 'day', '[]');
            });



                if (select === "Все страны") {
                    for (const iterator of cntryAll) {
                            const array = dateReg.filter( (elem: any) => {  
                            return elem.countriesAndTerritories === iterator;  
                        });
                   
                       array.reverse();
                       arrayData.push(...array);
                   }
               } else {
                    const array = dateReg.filter( (elem: any) => {  
                       return elem.countriesAndTerritories === select;  
                    });
                   
                       array.reverse();
                       arrayData.push(...array);
               }
           
               for (const iterator of cntryAll) {
                   
                   arrayData.forEach((item: any, i: any, array: any) => {
                           if (item.countriesAndTerritories === iterator) {
                               countCases += array[i].cases;
                               item.casesAll = countCases;
                               countDeaths += array[i].deaths;
                               item.deathsAll = countDeaths;
                           } 
                       });
                   countDeaths = 0;
                   countCases = 0;
               }


            const arrdataChart = arrayData.filter((item: any) => {
                const [day, month, year] = item.dateRep.split('/');
                const daysInMonth = dayjs(`${year}-${month}-${day}`).daysInMonth();
                return item.day === String(daysInMonth) || (item.day === "14" && item.month === "12");
            });


        // find unique date and sum other values 
        const arrdataChartNew = arrdataChart.reduce((a: any,c: any)=>{
            let x = a.find((e: any)=>e.dateRep===c.dateRep)
            if(!x) a.push(Object.assign({},c))
            else  {
                x.casesAll += c.casesAll;
                x.deathsAll += c.deathsAll
            }
            return a;
        }, []);

        const arrObject =  arrdataChartNew.map((item: any) => {
            const [day, month, year] = item.dateRep.split('/');
            return {dateRep: new Date(year, month, 0), casesAll: item.casesAll, deathsAll: item.deathsAll};
        });
                
            return [...arrObject]

        }
    }

    const ChartLine = () => {
        
        const [options] = useState<AgChartOptions>({
            title: {
                text: 'Заболеваемость и смерти COVID-19',
            },
            data: makeFunction(data, vStart, vEnd, selectValue, ctrieValue),
            series: [
                {
                    type: 'line',
                    xKey: 'dateRep',
                    yKey: 'casesAll',
                    yName: 'Заболевание',
                },
                {
                    type: 'line',
                    xKey: 'dateRep',
                    yKey: 'deathsAll',
                    yName: 'Смерти',
                },
            ],

            axes: [
                {
                    type: 'time',
                    position: 'bottom',
                    label: {
                        format: '%b',
                    },
                },
                {
                    type: 'number',
                    position: 'left',
                    title: {
                        text: 'Случаи',
                    },
                    nice: true,
                },
            ],
        }); 
    
        return <AgChartsReact options={options} />;
    };

    return(
        <>
            <Container style={{padding: "12px"}}>
                    <Row>
                        <Col>
                            <DropdownButton id="dropdown-basic-button" title="Выберите способ изображения">
                                <Dropdown.Item><Link to="/" className="link-offset-2 link-underline link-underline-opacity-0 link-info" >Таблица</Link></Dropdown.Item>
                                <Dropdown.Item><Link to="/function" className="link-offset-2 link-underline link-underline-opacity-0 link-primary">График</Link></Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                    <Row className="grid column-gap-1row justify-content-evenly" style={{paddingTop: "20px", paddingBottom: "20px"}}>
                        <Col className="col-2">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                label="Значение от"
                                value={vStart}
                                format="DD-MM-YYYY"
                                defaultValue={dayjs('2019-12-31')}//yyyy-mm-dd
                                minDate={minDate}
                                maxDate={maxDate}
                                onChange={(newValue, context) =>{ 
                                    if (context.validationError == null) {
                                        setStart(newValue);
                                    }
                                }}
                                />
                            </LocalizationProvider>
                        </Col>
                        <Col className="col-2"> 
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                label="Значение до"
                                value={vEnd}
                                format="DD-MM-YYYY"
                                defaultValue={dayjs('2020-12-14')}
                                minDate={minDate}
                                maxDate={maxDate}
                                onChange={(newValue, context) =>{ 
                                    if (context.validationError == null) {
                                        setEnd(newValue);
                                    }
                                }}
                                />
                            </LocalizationProvider>
                        </Col>
                        <Col>
                            {vResBtn ? <MakeButtonRes /> : ""}
                        </Col>
                    </Row>
                    <Row style={{paddingBottom: "20px", paddingTop: "20px"}}>
                        <Col style={{width: "50%"}}>
                            {AllCntry(ctrieValue)}
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{height: "900px"}}>
                            <ChartLine />
                        </Col>
                    </Row>
            </Container>
                        
        </>
    );
}

export default Function;