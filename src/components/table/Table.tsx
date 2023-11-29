import "./Table.css";
import { Link } from 'react-router-dom';
import {Button, Container, Row, Col, Pagination, InputGroup, Form }from 'react-bootstrap';
import Tables from 'react-bootstrap/Table';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Table = () => {

    const makeTable = () => {
        return (
            <>
            </>
        );
    };

    return(  
        <>
        <div >
            <Container style={{background: "#74bbce", border: "2px solid"}}>
                <Row>
                    <Col><button>Фильтровать по полю...</button>
                        <Form.Select size="sm">
                                <option>Small select</option>
                        </Form.Select>
                    </Col>
                    <InputGroup className="mb-3" size="sm" style={{width: "15%"}}>
                        <Form.Control
                        placeholder="Поиск страны..."
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        />
                        <Button variant="outline-secondary" id="button-addon2">
                        Button
                        </Button>
                        <Form.Control
                        placeholder="Значение от"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        />
                        <Form.Control
                        placeholder="Значение до"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        />
                    </InputGroup>
                        <button>Значение от</button>
                        <button>Значение до</button>

                </Row>
                <Row className="mb-3">
                    <Col lg={{ offset: 10}}>
                        <button>Сбросить фильтры</button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Tables striped bordered hover>
                            <thead className="table-warning">
                                <tr>
                                <th>Страна</th>
                                <th>Количество случаев</th>
                                <th>Количество смертей</th>
                                <th>Количество случаев всего</th>
                                <th>Количество смертей всего</th>
                                <th>Количество случаев на 1000 жителей</th>
                                <th>Количество сметей на 1000 жителей</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="table-light">
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>a</td>
                                <td>s</td>
                                <td>f</td>
                                </tr>
                                <tr className="table-secondary">
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                                <td>s</td>
                                <td>d</td>
                                <td>v</td>
                                </tr>
                                <tr>
                                <td>3</td>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>3</td>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                                </tr>
                            </tbody>
                        </Tables>
                    </Col>
                </Row>

                <Row>
                    <Col lg={{ offset: 9}}>
                        <Pagination>
                            <Pagination.First  />
                            <Pagination.Item>{1}</Pagination.Item>
                            <Pagination.Item>{2}</Pagination.Item>
                            <Pagination.Item>{3}</Pagination.Item>
                            <Pagination.Item>{4}</Pagination.Item>
                            <Pagination.Ellipsis />
                            <Pagination.Last />
                        </Pagination>
                    </Col>
                </Row>

            </Container>
        </div>
        </>
      
    );
}

export default Table;