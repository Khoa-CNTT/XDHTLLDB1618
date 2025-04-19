import { Request, Response } from 'express'
import statisticalService from '~/services/statistical.services'

export const getStatisticalController = async (req: Request, res: Response) => {
  const result = await statisticalService.getStatistical()

  res.status(200).json({
    message: 'Statistical data retrieved successfully',
    data: result
  })
}
