import {get, post} from 'http'
import { deployUrl } from '../src/components/domain/domain'

export const APIgetRealtime = params => get('api/monitor/getall', params)
export const APIgetHourData = params => get('api/hour/query/' + localStorage.getItem('statisticyear_start') + '/' + localStorage.getItem('Home_Enterprise_Select') + '/' + localStorage.getItem('port'), params)
