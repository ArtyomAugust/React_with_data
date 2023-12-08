/* eslint-disable no-loop-func */
import "./Table.css";
import { Link } from 'react-router-dom';
import {Button, Container, Row, Col, DropdownButton, Dropdown  }from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import useSWR, { mutate } from 'swr';
import dayjs, { Dayjs } from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import {
    ColDef,
    ITextFilterParams,
} from 'ag-grid-community';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



const  Table = () => {

    const fetcher =(url: string )=> fetch(url).then(r => r.json())
    const { data, error, isLoading, mutate } = useSWR("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/", fetcher);
    mutate(data);
    const gridRef = useRef<AgGridReact>(null);
    // const [isTime, setTime] = useLocalStorage('isTime', true);
    const [vStart, setStart] = useState<Dayjs | null>(dayjs('2019-12-31'));
    const [vEnd, setEnd] = useState<Dayjs | null>(dayjs('2020-12-14'));
    const [vResBtn, setResBtn] = useState(false);

    const minDate = dayjs("2019-12-31");
    const maxDate = dayjs('2020-12-14');
    let rows: any = [];
    console.log(dayjs(vStart).format('DD/MM/YYYY'),"timeS");
    console.log(dayjs(vEnd).format('DD/MM/YYYY'), "timeE")

    const columns: ColDef[] = [
        { 
        headerName: 'Страна', 
            field: 'countriesAndTerritories', 
            width: 150, 
            filter: 'agTextColumnFilter', 
            floatingFilter: true,
            filterParams: {
                filterPlaceholder: 'Введите страну...',
              } as ITextFilterParams, 
        },
        { 
            headerName: 'Количество случаев', 
            field: 'cases', 
            width: 200 ,
            filter: 'agNumberColumnFilter', 
            floatingFilter: true,
            filterParams: {
                filterPlaceholder: 'Введите число...',
              } as ITextFilterParams,  
        },
        { 
            headerName: 'Количество смертей', 
            field: 'deaths', 
            width: 200 ,
            filter: 'agNumberColumnFilter', 
            floatingFilter: true, 
            filterParams: {
                filterPlaceholder: 'Введите число...',
              } as ITextFilterParams,  
        },
        { 
            headerName: 'Количество случаев всего', 
            field: 'casesAll', 
            width: 200 ,
            filter: 'agNumberColumnFilter', 
            floatingFilter: true,
            filterParams: {
                filterPlaceholder: 'Введите число...',
              } as ITextFilterParams,  
        },
        { headerName: 'Количество смертей всего', 
            field: 'deathsAll', 
            width: 200 ,
            filter: 'agNumberColumnFilter', 
            floatingFilter: true,
            filterParams: {
                filterPlaceholder: 'Введите число...',
            } as ITextFilterParams,  
        },
        { 
            headerName: 'Количество случаев на 100000 жителей', 
            field: 'Cumulative_number_for_14_days_of_COVID-19_cases_per_100000', 
            width: 300 ,
            filter: 'agNumberColumnFilter', 
            floatingFilter: true, 
            filterParams: {
                defaultOption: 'greaterThan',
                filterPlaceholder: 'Введите число...',
              } as ITextFilterParams,  },
        { 
            headerName: 'Количество смертей на 100000 жителей', 
            field: 'Cumulative_number_Deaths_for_14_days_of_COVID_19_cases_per_100000', 
            width: 300,
            filter: 'agNumberColumnFilter', 
            floatingFilter: true,
            filterParams: {
                defaultOption: 'greaterThan',
                filterPlaceholder: 'Введите число...',
              } as ITextFilterParams,   
        }
    ];

    useEffect(() => {
        
        resetTimeBool(vStart, vEnd);        
        
    }, [vStart, vEnd]);

    const defaultColDef = useMemo<ColDef>(() => {
        return {
          flex: 1,
          minWidth: 150,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        };
    }, []);  

    const resetState = useCallback(() => {
        gridRef.current!.api.setFilterModel(null);
        console.log('column state reset');
    }, []);


    const resetTimeBool = (vStart: any, vEnd: any) => {
        console.log(vStart,"resetTimeBool");
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

    const makeTable = (dataSer: any, start: any, end: any) => {

        let countCases: number = 0;
        let countDeaths: number = 0;
        let cntryAll = []; 
        let record: any = [];
        let arrayData: any = [];
        let isTime: any = [];
        // let arrayColumns: any = [];


        if (dataSer !== undefined) {

            const vStart = dayjs(start).format('YYYY-MM-DD');
            const vEnd = dayjs(end).format('YYYY-MM-DD');
            isTime = [vStart, vEnd];
            localStorage.setItem('isTime', JSON.stringify(isTime));
            console.log(localStorage.getItem('isTime'), "localStorage");
            
            record = dataSer.records;
            console.log(record, "record");
            //Adding id---------------------------------
            record.forEach((item:any, i: any): any => {
                item.id = i + 1;
            });

            const dateReg = record.filter((item:any, i: any): any => {
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


                let count: any = -1;
                for (let index = 13; index < array.length; index++) {
                    let all: number = 0
                    count++;
                    for (let j = 13; j > 0; j--) {
                        all += array[j + count].deaths;
                        
                    }
                    array[index].Cumulative_number_Deaths_for_14_days_of_COVID_19_cases_per_100000 = ((all / array[index].popData2019)*100000).toFixed(8);
                }  


                arrayData.push(...array);
            }
            console.log(arrayData,'arrayData');
            
            
            // console.log(cntryAll, "cntryAll");
            for (const iterator of cntryAll) {
                
                arrayData.forEach((item: any, i: any, array: any) => 
                {
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
            rows = [...arrayData];
            
        }

    }

    const getDisplayedRowCount = useCallback(() => {
        var count = gridRef.current!.api.getDisplayedRowCount();
        // console.log('getDisplayedRowCount() => ' + count);
        if (gridRef.current !== null) {
            

            if (count === 0) {
                gridRef.current!.api.showNoRowsOverlay();
            } else {
                gridRef.current!.api.hideOverlay();
            }
        }
        
    }, []);

    

    makeTable(data, vStart, vEnd);
    // getDisplayedRowCount();
    return(  
        <>  
            <Container style={{paddingTop: "12px"}}>
                <Row style={{paddingTop: "12px"}}>
                    <Col>
                        <DropdownButton id="dropdown-basic-button" title="Выберите способ изображения">
                            <Dropdown.Item><Link to="/" className="link-offset-2 link-underline link-underline-opacity-0 link-primary">Таблица</Link></Dropdown.Item>
                            <Dropdown.Item><Link to="/function" className="link-offset-2 link-underline link-underline-opacity-0 link-info link-info">График</Link></Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
                <Row className="grid gap-1 column-gap-3row justify-content-evenly" style={{paddingTop: "20px", paddingBottom: "20px"}}>
                    <Col className="col-3">
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
                    <Col className="col-3"> 
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
                    <Col>
                        <Button variant="outline-warning" onClick={resetState}>Очистить фильтры</Button>{' '}
                    </Col>
                </Row>
                <Row> 
                    <Col className="mb-2">
                        <div className="ag-theme-quartz" style={{ height: 500 }}>
                            <AgGridReact 
                                ref={gridRef}
                                rowData={rows} 
                                columnDefs={columns}
                                pagination={true}
                                paginationAutoPageSize={true}
                                defaultColDef={defaultColDef}
                                onFilterChanged = {getDisplayedRowCount}
                                overlayNoRowsTemplate={
                                    '<span style="padding: 10px; border: 2px solid #666; background: #55AA77">Ничего не найдено</span>'
                                  }
                            />
                        </div>  
                    </Col>
                </Row>    
            </Container>
                
            </>
    );
}

export default Table;