/* eslint-disable no-loop-func */
import "./Function.css";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {Button, Container, Row, Col, Pagination, InputGroup, Form, DropdownButton, Dropdown  }from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import dayjs, { Dayjs } from 'dayjs';
import { AgChartsReact } from 'ag-charts-react';
import { AgChartOptions, AgCharts } from 'ag-charts-community';
import {useFetch} from "../hooks/useFetch";
import { type } from "@testing-library/user-event/dist/type";
import { isObject } from "@mui/x-data-grid/internals";

const Function = () => {

    const { data, error } = useFetch("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/");
    let charData: any = []
    // useEffect(() => {
    //     makeFunction(data);
    // }, [data])


    const makeFunction = (dataSer: any) => {
        
        let countCases: number = 0;
        let countDeaths: number = 0;
        let cntryAll = []; 
        let record: any = [];
        let arrayData: any = [];
        let arrdataChartNew = [];

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
            const vStart = dayjs("2019-12-31").format('YYYY/MM/DD');
            const vEnd = dayjs("2020-12-14").format('YYYY/MM/DD');

            record = dataSer.records;
            console.log(record, "record");

            const dateReg = record.filter((item:any, i: any, array:any): any => {
                const [day, month, year] = item.dateRep.split('/');
                return dayjs(`${year}-${month}-${day}`).isBetween(`${vStart}`, `${vEnd}`, 'day', '[]');
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
            
            
            for (const iterator of cntryAll) {
                const array = dateReg.filter( (elem: any) => {  
                    return elem.countriesAndTerritories === iterator;  
                });
                // console.log(array, "array");
                
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
                const daysInMonth = dayjs(`${year}-${month}-${day}`).daysInMonth()
                // if(year ){

                // }
                return item.day === String(daysInMonth);
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
            return {dateRep: new Date(year, month, day), casesAll: item.casesAll, deathsAll: item.deathsAll};
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
            data: makeFunction(data),
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
                    min: -10,
                    max: 80000000,
                    tick: {
                        interval: 10000000,
                        width: 5,
                    },
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
                            <DropdownButton id="dropdown-basic-button" title="Dropdown button">
                                <Dropdown.Item><Link to="/">Таблица</Link></Dropdown.Item>
                                <Dropdown.Item><Link to="/function">График</Link></Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ChartLine />
                        </Col>
                    </Row>
            </Container>
                        
        </>
    );
}

export default Function;