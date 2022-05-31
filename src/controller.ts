import { Request, Response } from 'express';
import axios from 'axios';
import * as withdrawService from './service/withdrawService';

export let withdraw = async (req, res) => {
    const { category } = req.params;
    withdrawService.withdraw();
    return res.status(200).send('withdraw_success');
};