import { useState } from 'react'

import TimeMonthForm from '../../ui/TimeMonthForm';
import TimeWeekForm from '../../ui/TimeWeekForm';

const LargeTimeModal = () => {

  const [typeForm, setTypeForm] = useState('week')

  return (
    <>
        <div className='d-flex justify-content-around mb-4'>
            <button onClick={() => setTypeForm('week')} className='btn btn btn-danger'>Buscar por semana</button>
            <button onClick={() => setTypeForm('month')}  className='btn btn btn-success'>Buscar por mes</button>
        </div>
        {typeForm === 'month' && <TimeMonthForm />}
        {typeForm === 'week' && <TimeWeekForm />}
        
    </>
  )
}

export default LargeTimeModal