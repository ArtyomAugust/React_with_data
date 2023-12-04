import "./Function.css";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {Button, Container, Row, Col, Pagination, InputGroup, Form, DropdownButton, Dropdown  }from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"
import dayjs, { Dayjs } from 'dayjs';
import { LineChart } from '@mui/x-charts/LineChart';
import {useFetch} from "../hooks/useFetch";

const Function = () => {

    const { data, error } = useFetch("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/");

    useEffect(() => {
        makeFunction(data);
    }, [data])


    const makeFunction = (data: any) => {
        console.log(data, "data");
        
    }

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

                        </Col>
                    </Row>
            </Container>
                        
        </>
    );
}

export default Function;