import "./Table.css";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import useSWR, { mutate } from 'swr';
import dayjs, { Dayjs } from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { useState, useCallback, useEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';



const  Table = () => {

    const fetcher =(url: string )=> fetch(url).then(r => r.json())
    const { data, error, isLoading, mutate } = useSWR("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/", fetcher);
    mutate(data);
    const [vStart, setStart] = useState<Dayjs | null>(dayjs('2019-12-31'));
    const [vEnd, setEnd] = useState<Dayjs | null>(dayjs('2020-12-14'));

    const minDate = dayjs("2019-12-31");
    const maxDate = dayjs('2020-12-14') ;
    let rows: GridRowsProp = [];
    console.log(dayjs(vStart).format('DD/MM/YYYY'),"timeS");
    console.log(dayjs(vEnd).format('DD/MM/YYYY'), "timeE")

      
    const columns: GridColDef[] = [
        { field: 'countriesAndTerritories', headerName: 'Страна', width: 150 },
        { field: 'cases', headerName: 'Количество случаев', width: 250 },
        { field: 'deaths', headerName: 'Количество смертей', width: 250 },
        { field: 'casesAll', headerName: 'Количество случаев всего', width: 250 },
        { field: 'deathsAll', headerName: 'Количество смертей всего', width: 250 },
        { field: 'Cumulative_number_for_14_days_of_COVID-19_cases_per_100000', 
        headerName: 'Количество случаев на 100000 жителей', width: 300 },
        { field: 'quantityDeath1000', headerName: 'Количество смертей на 1000 жителей', width: 300 }
    ];


    // useCallback(() => {
    //     setTimeout(()=>{
    //         makeTable(data);
    //     },1000)
    //     console.log("useCallback");
        
    // }, [vStart, vEnd]);

    const  makeTable = (dataSer: any, start: any, end: any) => {

        let countCases: number = 0;
        let countDeaths: number = 0;
        let cntryAll = []; 
        let record: any = [];
        let arrayData: any = [];
        // let arrayColumns: any = [];


        if (dataSer !== undefined) {

            const vStart = dayjs(start).format('YYYY/MM/DD');
            const vEnd = dayjs(end).format('YYYY/MM/DD');

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

    makeTable(data, vStart, vEnd);

    return(  
        <>  
            <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                    label="Controlled picker"
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
                    <DatePicker
                    label="Controlled picker"
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
            </div>
            <div style={{ height: 500, width: '100%'}}>
                <DataGrid rows={rows} columns={columns} />
            </div>

        </>
      
    );
}

export default Table;