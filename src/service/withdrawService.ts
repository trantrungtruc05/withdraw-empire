import { Request, Response } from 'express';
import axios from 'axios';
import { ConfigInfo } from '../entity/ConfigInfo';
import nodemailer from 'nodemailer'
const { QueryTypes } = require('sequelize');
import connection from '../db/connection';
var querystring = require('querystring');
import { v4 as uuidv4 } from 'uuid';

export let withdraw = async () => {
    try {
        const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
        console.log(`Connect withdraw empire`);

        var cookieEtopWithdrawItem = await ConfigInfo.findAll({ where: { key: "empire_withdraw", type: "cookie" } });

        var items = await connection.query("select ep.name, qw.empire_price_custom empirePriceCustom, ep.original_price_not_percentage originalPriceNotPercentage, ep.item_id itemId from empire_page ep inner join queue_empire_item_withdraw qw on ep.name = qw.name where qw.empire_price_custom >= ep.original_price_not_percentage and qw.status = false ", { type: QueryTypes.SELECT });
        console.log(items.length)
        for (var i = 0; i < items.length; i++) {

            var token = await generateToken();
            // sleep
            await snooze(1000);

            console.log('vo k ')

            // start withdraw
            const withdrawLink = `https://csgoempire.com/api/v2/trading/deposit/${(items[i] as any).itemid}/withdraw`;
            console.log(withdrawLink)
            console.log(`request : ${querystring.stringify({
                security_token: `${token}`,
                coin_value: `${Math.round((items[i] as any).originalpricenotpercentage * 100)}`
            })}`);

            axios.post(withdrawLink, querystring.stringify({
                security_token: `${token}`,
                coin_value: `${Math.round((items[i] as any).originalpricenotpercentage * 100)}`
            }), {
                headers: {
                    'Cookie': cookieEtopWithdrawItem[0].value
                }
            });

            // update status withdraw empire
            await connection.query(`update queue_empire_item_withdraw set status = true where name = '${(items[i] as any).name}'`)

            // send mail
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'crawlgame91@gmail.com',
                    pass: 'Trungtruc'
                }
            });

            var mailOptions = {
                from: 'crawlgame91@gmail.com',
                to: 'hotrongtin90@gmail.com;hominhtrang2021@gmail.com',
                // to: 'trantrungtruc220691@gmail.com',
                subject: `Rút item empire ${(items[i] as any).name}`,
                text: `Rút item empire ${(items[i] as any).name}`
            };

            transporter.sendMail(mailOptions);

        }
    } catch (e) {

    }

};


export let generateToken = async () => {

    try{
        var cookieEmpireWithdraw = await ConfigInfo.findAll({ where: { key: "empire_withdraw", type: "cookie" } });
    const genTokenLink = 'https://csgoempire.com/api/v2/user/security/token';

    var tokenRes = await axios.post(genTokenLink, querystring.stringify({
        code: '0000',
        uuid: uuidv4()
    }), {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Cookie': cookieEmpireWithdraw[0].value
        }
    });

    var token = tokenRes.data.token;
    console.log(`Token generate ${token}`);
    }catch(e){
        console.log(e);
    }
    

    return token;
}