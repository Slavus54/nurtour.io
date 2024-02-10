import React from 'react'
import {JobCommonInfoType} from '../../types/types'

const JobCommonInfo: React.FC<JobCommonInfoType> = ({dateUp, time}) => {
    return (
        <div className='items small'>
            <h4 className='pale'>Date: {dateUp}</h4>
            <h4 className='pale'>Start in {time}</h4>
        </div>
    )
}

export default JobCommonInfo 