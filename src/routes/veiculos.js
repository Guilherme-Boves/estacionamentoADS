// API REST de Veículos
import express from 'express'
import sql from 'mssql'
import { sqlConfig } from '../sql/config.js'
const router = express.Router()

/******************************************
 * GET /veiculos
 * Retornar a lista de todos os veículos
 *****************************************/
router.get("/", (req, res) => {
    try{
        sql.connect(sqlConfig).then(pool => {
            return pool.request()
            .execute('SP_S_VEI_VEICULO')
        }).then(dados => {
            res.status(200).json(dados.recordset)
        }).catch(err => {
            res.status(400).json(err) //400 - bad request
        })
    } catch (err){
        console.log(err)
    }
})

/******************************************
 * GET /veiculos/:placa
 * Retornar um veículo através da placa
 ******************************************/
 router.get("/:placa", (req, res) => {
     const placa = req.params.placa
    try{
        sql.connect(sqlConfig).then(pool => {
            return pool.request()
            .input('placa', sql.Char(7), placa)
            .execute('SP_S_VEI_VEICULO_PLACA')
        }).then(dados => {
            res.status(200).json(dados.recordset)
        }).catch(err => {
            res.status(400).json(err) //400 - bad request
        })
    } catch (err){
        console.log(err)
    }
})

/******************************************
 * POST /veiculos/
 * Insere um novo veículo
 ******************************************/
router.post("/", (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const {placa, nome, descricao, fabricacao, preco} = req.body
        return pool.request()
        .input('placa', sql.Char(7), placa)
        .input('nome', sql.VarChar(50), nome)
        .input('descricao', sql.VarChar(200), descricao)
        .input('fabricacao', sql.Date, fabricacao)
        .input('preco', sql.Numeric, preco)
        .output('codigogerado', sql.Int)
        .execute('SP_I_VEI_VEICULO')
    }).then(dados => {
        res.status(200).json(dados.output)
    }).catch(err => {
        res.status(400).json(err.message) // Bad request
    })
})

/******************************************
 * PUT /veiculos
 * Altera os dados de um veículo
 ******************************************/
 router.put("/", (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const {placa, nome, descricao, fabricacao, preco} = req.body
        return pool.request()
        .input('placa', sql.Char(7), placa)
        .input('nome', sql.VarChar(50), nome)
        .input('descricao', sql.VarChar(200), descricao)
        .input('fabricacao', sql.Date, fabricacao)
        .input('preco', sql.Numeric, preco)        
        .execute('SP_U_VEI_VEICULO')
    }).then(dados => {
        res.status(200).json('Veículo alterado com sucesso!')
    }).catch(err => {
        res.status(400).json(err.message) // Bad request
    })
})

/******************************************
 * DELETE /veiculos/:placa
 * Apaga um veículo pela placa
 ******************************************/
router.delete('/:placa', (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const placa = req.params.placa
        return pool.request()
        .input('placa', sql.Char(7), placa)
        .execute('SP_D_VEI_VEICULO')
    }).then(dados => {
        res.status(200).json('Veículo excluido com sucesso!')
    }).catch(err => {
        res.status(400).json(err.message)
    })
})


export default router