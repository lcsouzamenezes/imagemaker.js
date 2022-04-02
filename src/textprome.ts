import request from 'request';
import cheerio from 'cheerio';
import { IGenerateNewCookies, IMaker } from '.'

export function TextPro(url: string, text: string[], headers: IGenerateNewCookies): Promise<IMaker> {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: "GET",
            followAllRedirects: true,
            headers: headers.textpro
        }, async function (err, res, body) {
            if (err) return reject({
                success: false
            })
            const $ = cheerio.load(body);

            let servidor = $('#build_server').val()
            let servidorId = $('#build_server_id').val()
            let token = $('#token').val()

            let types = []
            $('.item-input.select_option_wrapper >  label').each((i, elem) => {
                types.push($(elem).find('input').val())
            })
            let form;
            if (types.length != 0) {
                form = {
                    'autocomplete0': '',
                    // @ts-ignore
                    'radio0[radio]': types[Math.floor(Math.random() * types.length)],
                    'text': [
                        ...text
                    ],
                    'submit': 'GO',
                    'token': token,
                    'build_server': servidor,
                    'build_server_id': Number(servidorId)
                }
            } else {
                form = {
                    'autocomplete0': '',
                    'text': [
                        ...text
                    ],
                    'submit': 'GO',
                    'token': token,
                    'build_server': servidor,
                    'build_server_id': Number(servidorId)
                }
            }
            request({
                url: url,
                method: "POST",
                followAllRedirects: true,
                headers: headers.textpro,
                form: form
            }, async function (err, res, body) {
                if (err) return reject({
                    success: false
                })
                const $ = cheerio.load(body)
                request({
                    url: 'https://textpro.me/effect/create-image',
                    method: 'POST',
                    headers: headers.textpro,
                    form: JSON.parse($('#form_value').first().text())
                }, async function (err, res, body) {
                    if (err) return reject({
                        success: false
                    })
                    let parse = JSON.parse(body);
                    resolve({
                        success: true,
                        imageUrl: servidor + parse.image,
                        session_id: parse.session_id
                    })
                })
            })
        })
    })
};