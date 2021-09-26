import sql from 'mssql'
import { sqlConfig } from './sql/config.js'

sql.on('error', err => {
    console.error(err)
})

sql.connect(sqlConfig).then(pool => {
    //Vamos executar a Stored Procedure
    return pool.request()
    .input('placa', sql.Char(7), 'ABC9955')
    .input('nome', sql.VarChar(50), 'Brasilia')
    .input('descricao', sql.VarChar(200), 'Brasilia para colecionador')
    .input('fabricacao', sql.Date, '1982-04-02')
    .input('preco', sql.Numeric, 3500)
    .output('codigogerado', sql.Int)
    .execute('SP_I_VEI_VEICULO')
}).then(result => {
    console.log(result)
}).catch(err => {
    console.log(err.message)
})