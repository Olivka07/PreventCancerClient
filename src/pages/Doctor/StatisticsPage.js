import 'devextreme/dist/css/dx.light.css';

import { PieChart, Series, Label, Connector, Export, Font, Title, Legend } from 'devextreme-react/pie-chart';
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { useEffect, useState } from 'react';
import { request } from '../../request/request';

 


export const StatisticsPage = () => {

    const [statistics, setStatistics] = useState([])
    const [btnPol, setBtnPol] = useState(true)
    const [windowWidth, setWindowWith] = useState(window.innerWidth)

    const ftchGetRiskPol = async() => {
        try {
            const result = await request('/api/patient/statistics/pol')
            if (result.ok) {
                setStatistics([...result.statistics])
            }
        } catch (e) {}
    }

    const ftchGetRiskAge = async() => {
        try {
            const result = await request('/api/patient/statistics/age')
            if (result.ok) {
                setStatistics([...result.statistics])
            }
        } catch (e) {}
    }

    useEffect(() => {
        ftchGetRiskPol()
        window.addEventListener('resize', handlerWindowChange)
        return () => {
            window.removeEventListener('resize', handlerWindowChange)
        }
    }, [])

    const clickButtonAge = () => {
        setBtnPol(false)
        ftchGetRiskAge()
    }

    const clickButtonPol = () => {
        setBtnPol(true)
        ftchGetRiskPol()
    }

    const handlerWindowChange = () => {
        setWindowWith(window.innerWidth)
    }




    


    return (
        <>
            <Header/>
                <main>
                    <p className="page-header">
                        Статистика
                    </p>

                    <div className='flexing-on-page-statictics'>
                        <div className='div-btn-statistics'>
                            <button
                                onClick={clickButtonPol} 
                                disabled={btnPol}
                            >
                                Пол
                            </button>
                            <button
                                onClick={clickButtonAge}
                                disabled={!btnPol}
                            >
                                Возраст
                            </button>
                        </div>
                        <div className='with-statistics'>
                            {(btnPol &&
                                <>
                                    <PieChart
                                        // title="Количество больных по половому признаку"
                                        dataSource={statistics}
                                        palette="Office"
                                        type="pie"
                                        className='pie'
                                    >
                                        <Legend>
                                            <Font size={windowWidth>1640 ? 30: 20}/>
                                        </Legend>
                                        <Title text={"Количество больных по половому признаку"}>
                                            <Font size={windowWidth>1640 ? 50: 20}/>
                                        </Title>
                                        <Series 
                                            argumentField="pol" 
                                            valueField="amount"
                                        >
                                            <Label visible={true}>
                                                <Connector visible={true} width={1} />
                                                <Font size={windowWidth>1640 ? 30 : 20}/>
                                            </Label>
                                        </Series>
                                        {/* <Export enabled={true} /> */}
                                    </PieChart>
                                </>)
                                ||
                                <>
                                    <PieChart
                                        title="Количество больных по возрастным группам"
                                        dataSource={statistics}
                                        palette="Office"
                                        type="pie"
                                        className='pie'
                                    >
                                        <Series 
                                            argumentField="age" 
                                            valueField="amount"
                                        >
                                            <Label visible={true}>
                                                <Connector visible={true} width={1} />
                                                <Font size={30}/>
                                            </Label>
                                        </Series>
                                        {/* <Export enabled={true} /> */}
                                    </PieChart>
                                </>

                            }
                            
                        </div>
                    </div>
                    
                </main>
            <Footer/>
        </>
    )
}