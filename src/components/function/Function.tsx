/* eslint-disable no-loop-func */
import "./Function.css";
import { useReadLocalStorage } from 'usehooks-ts'
import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {Container, Row, Col, DropdownButton, Dropdown, Form}from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import dayjs, { Dayjs } from 'dayjs';
import { AgChartsReact } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';
import {useFetch} from "../hooks/useFetch";




const Function = () => {
    const chartRef = useRef<AgChartsReact>(null);
    const { data, error } = useFetch("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/");
    const [selectValue, setSelect] = useState("Все страны");
    const isTime = useReadLocalStorage('isTime')
    let charData: any = []
    // useEffect(() => {
    //     makeFunction(data);
    // }, [data])

    // handleChange(event) {
    //     setState({value: event.target.value});
    //  }

    const AllCntry = (dataSer: any) => {
        if (dataSer !== undefined) {
            

            let cntryAll = dataSer.records.map((item: any) => {
                return item.countriesAndTerritories;
            });
            
            cntryAll = cntryAll.filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            
            cntryAll.push('Все страны');
            cntryAll.reverse();
            let allItems: any = [];

            console.log(cntryAll, "AllCntry");

            // for (const iterator of cntryAll) {
            //     if (iterator === 'Все страны') {
            //         allItems = <Dropdown.Item aria-selected>{iterator}</Dropdown.Item>;
            //     }
            //     allItems = <Dropdown.Item>{iterator}/Dropdown.Item>;
            // }
            const result = cntryAll.map((item: any): any => {
                return <option value={item}>{item}</option>;
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

    const makeFunction = (dataSer: any, isTime: any, select: string|"") => {
        
        let countCases: number = 0;
        let countDeaths: number = 0;
        let cntryAll = []; 
        let record: any = [];
        let arrayData: any = [];
        let arrdataChartNew = [];
        let vStart = "";
        let vEnd = "";
        // let istime =  JSON.parse(localStorage.getItem('isTime'));

        console.log(isTime, "localStorage");
        console.log(select, "select");
        
        // let arrdataChart = [];
        // let arrayColumns: any = [];

        // type dataChart = {
        //     country: string;
        //     date: string;
        //     deathsMonth: number;
        //     casesMonth: number;
        // }

        if (dataSer !== undefined) {
            console.log(data, "data");

            vStart = dayjs("2019-12-31").format('YYYY-MM-DD');
            vEnd = dayjs("2020-12-14").format('YYYY-MM-DD');

            record = dataSer.records;
            console.log(record, "record");

            const dateReg = record.filter((item:any, i: any, array:any): any => {
                const [day, month, year] = item.dateRep.split('/');
                return dayjs(`${year}-${month}-${day}`).isBetween(`${isTime[0]}`, `${isTime[1]}`, 'day', '[]');
            });
            console.log(dateReg, "dateReg");
            cntryAll = record.map((item: any) => {
                return item.countriesAndTerritories;
            });
            
            cntryAll = cntryAll.filter((value: any, index: any, self: any) => {
                return self.indexOf(value) === index;
            });
            // console.log(cntryAll,'cntryAll');
            // const [day, month, year] = '23/05/2020'.split('/');
            // const datee = dayjs(`${year}-${month}-${day}`).isBetween('2019-12-31', '2020-12-14', 'day', '[]');
            if (select === "Все страны") {
                 for (const iterator of cntryAll) {
                const array = dateReg.filter( (elem: any) => {  
                    return elem.countriesAndTerritories === iterator;  
                });
                // console.log(array, "array");
                
                    array.reverse();
                    arrayData.push(...array);
                }
            } else {
                const array = dateReg.filter( (elem: any) => {  
                    return elem.countriesAndTerritories === select;  
                });
                // console.log(array, "array");
                
                    array.reverse();
                    arrayData.push(...array);
            }
            console.log(arrayData , "arrayData");
        
           


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
                const daysInMonth = dayjs(`${year}-${month}-${day}`).daysInMonth()
                // if(year ){

                // }
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
        },[])

        const arrObject =  arrdataChartNew.map((item: any, ind:any, array:any) => {
            const [day, month, year] = item.dateRep.split('/');
            return {dateRep: new Date(year, month, 0), casesAll: item.casesAll, deathsAll: item.deathsAll};
        });
            console.log(arrdataChartNew, 'arrdataChartNew');
            console.log(arrObject, 'arrObject');
                
            return charData = [...arrObject]
        }
    }

    const ChartLine = () => {
        console.log(charData, "charData");
        
        const [options, setOptions] = useState<AgChartOptions>({
            title: {
                text: 'Заболеваемость и смерти COVID-19',
            },
            data: makeFunction(data, isTime, selectValue),
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
                    <Row style={{paddingBottom: "20px", paddingTop: "20px"}}>
                        <Col style={{width: "50%"}}>
                            {AllCntry(data)}
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