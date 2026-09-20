/**
 * Script de formulário Fluig.
 *
 * Erro comum de quem está começando: confundir os eventos de ciclo de
 * vida. `event.loadCardEvent` dispara ao abrir/visualizar um card do
 * processo; `event.beforeSaveForm`/`event.afterSaveForm` disparam ao
 * salvar o formulário. Usar o evento errado faz a validação rodar na
 * hora errada (ou nunca rodar).
 */

var CAMPO_TITULO = 'titulo';
var CAMPO_SOLICITANTE = 'solicitante';

function exibirMensagemErro(mensagem) {
    // Boa prática: usar o componente de mensagem do próprio Fluig em vez de
    // alert() — mantém a UX consistente com o resto do formulário/processo.
    if (typeof WCMAPI !== 'undefined' && WCMAPI.showMessage) {
        WCMAPI.showMessage(mensagem, 'error');
    } else {
        console.error(mensagem);
    }
}

function campoPreenchido(nomeCampo) {
    var valor = getValue(nomeCampo);
    return valor != null && String(valor).trim().length > 0;
}

// Validação client-side é só uma primeira barreira de UX (feedback rápido
// pro usuário) — a regra de negócio "de verdade" continua validada no
// processo/servidor. Nunca confie só no client.
event.beforeSaveForm = function () {
    if (!campoPreenchido(CAMPO_TITULO)) {
        exibirMensagemErro('Informe o título da solicitação.');
        return false;
    }

    if (!campoPreenchido(CAMPO_SOLICITANTE)) {
        exibirMensagemErro('Informe o solicitante.');
        return false;
    }

    return true;
};

event.afterSaveForm = function () {
    // Ações pós-salvamento (ex.: log, integração) vão aqui — nunca dentro
    // de beforeSaveForm, que precisa retornar rápido para não travar o
    // fluxo de salvar/enviar o formulário.
    console.log('Formulário de solicitação salvo com sucesso.');
};