/**
 * Script do widget "Lista de Solicitações".
 *
 * Consome o dataset DatasetSolicitacoes (ver Fluig/dataset-exemplo) e
 * renderiza os resultados na view. Este arquivo concentra as práticas que
 * mais pegam quem está começando em widget Fluig.
 */
(function () {
    'use strict';

    var DATASET_NAME = 'DatasetSolicitacoes';
    var listaEl = document.getElementById('listaSolicitacoes');

    function escapeHtml(texto) {
        // Nunca insira texto vindo do dataset direto no innerHTML: ele pode
        // conter dados digitados por outro usuário (título de solicitação,
        // nome, etc.) e virar um vetor de XSS. Escapar é a defesa mínima.
        var div = document.createElement('div');
        div.textContent = String(texto == null ? '' : texto);
        return div.innerHTML;
    }

    function renderizarLista(registros) {
        if (!registros || registros.length === 0) {
            listaEl.innerHTML = '<li class="solicitacoes-vazio">Nenhuma solicitação encontrada.</li>';
            return;
        }

        var html = registros.map(function (registro) {
            var titulo = escapeHtml(registro.titulo);
            var solicitante = escapeHtml(registro.solicitante);
            return '<li class="solicitacoes-item">' +
                '<strong>' + titulo + '</strong>' +
                '<span> — ' + solicitante + '</span>' +
            '</li>';
        }).join('');

        listaEl.innerHTML = html;
    }

    function renderizarErro() {
        // A chamada ao dataset pode falhar por permissão, timeout ou dataset
        // fora do ar. Um widget que trata só o caminho feliz quebra em
        // produção sem nenhum feedback pro usuário.
        listaEl.innerHTML = '<li class="solicitacoes-erro">Não foi possível carregar as solicitações.</li>';
    }

    function carregarSolicitacoes() {
        // WCMAPI.DatasetFactory é a API client-side padrão do Fluig para
        // consumir datasets a partir de um widget.
        WCMAPI.DatasetFactory.getData(
            {
                dataset: DATASET_NAME,
                fields: ['titulo', 'solicitante', 'dataCriacao'],
                order: 'dataCriacao desc'
            },
            function (resposta) {
                renderizarLista(resposta && resposta.values);
            },
            function (erro) {
                console.error('[Lista de Solicitações] Falha ao consultar dataset:', erro);
                renderizarErro();
            }
        );
    }

    carregarSolicitacoes();
})();