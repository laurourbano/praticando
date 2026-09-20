/**
 * Dataset de exemplo: lista solicitações de uma tabela fictícia.
 *
 * Datasets Fluig são a única camada que deveria falar com banco/APIs
 * externas — widgets e formulários nunca acessam dados diretamente.
 * Este arquivo mostra o padrão DatasetBuilder e as práticas que evitam
 * os erros mais comuns de quem está começando: SQL injection, dataset
 * sem filtro (traz a tabela inteira) e exception sem contexto.
 */
import com.totvs.technology.foundation.sdk.services.ServiceManager
import com.totvs.technology.foundation.sdk.common.util.Logger

class DatasetSolicitacoes {

    private static final Logger logger = Logger.getLogger(DatasetSolicitacoes.class)

    Object execute(Object companyId, DatasetBuilder datasetBuilder, Map fields, Object[] constraints, Object sortFields) {

        datasetBuilder.addStructureField('titulo', ColumnType.STRING)
        datasetBuilder.addStructureField('solicitante', ColumnType.STRING)
        datasetBuilder.addStructureField('dataCriacao', ColumnType.DATETIME)

        // Boa prática: extrai e valida os filtros recebidos ANTES de montar a
        // consulta. Um dataset que ignora `constraints` sempre traz a tabela
        // inteira e filtra no client — não escala e é lento.
        String filtroSolicitante = extrairFiltro(constraints, 'solicitante')

        try {
            def registros = buscarSolicitacoes(companyId, filtroSolicitante)

            registros.each { registro ->
                def linha = datasetBuilder.addRow()
                datasetBuilder.setValue(linha, 'titulo', registro.titulo)
                datasetBuilder.setValue(linha, 'solicitante', registro.solicitante)
                datasetBuilder.setValue(linha, 'dataCriacao', registro.dataCriacao)
            }
        } catch (Exception e) {
            // Nunca deixe a exception subir sem contexto: quem for investigar
            // um dataset que "não retorna nada" precisa desse log pra saber
            // se foi erro de conexão, de query ou de permissão.
            logger.error("Erro ao consultar solicitações (companyId=${companyId}, filtro=${filtroSolicitante})", e)
        }

        return datasetBuilder
    }

    private String extrairFiltro(Object[] constraints, String nomeCampo) {
        if (!constraints) {
            return null
        }
        def constraint = constraints.find { it.getField() == nomeCampo }
        return constraint ? constraint.getInitialValue() : null
    }

    private List buscarSolicitacoes(Object companyId, String filtroSolicitante) {
        // Em um dataset real, a consulta usaria PreparedStatement (via
        // ServiceManager/DAO do Fluig) com parâmetros bindados — nunca
        // concatenando `filtroSolicitante` direto na string de SQL, o que
        // abriria brecha para SQL injection.
        //
        // Aqui, por ser um exemplo de estudo, apenas simula o retorno:
        def todasSolicitacoes = [
            [titulo: 'Compra de notebook', solicitante: 'Ana Souza', dataCriacao: new Date()],
            [titulo: 'Acesso ao sistema X', solicitante: 'Bruno Lima', dataCriacao: new Date()]
        ]

        if (!filtroSolicitante) {
            return todasSolicitacoes
        }
        return todasSolicitacoes.findAll { it.solicitante == filtroSolicitante }
    }
}