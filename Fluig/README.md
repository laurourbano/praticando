# Fluig — Projeto de Estudo

Este diretório reúne um exemplo mínimo e didático dos três pilares de
desenvolvimento no Fluig (TOTVS), para praticar a arquitetura real da
plataforma com boas práticas desde o início — não apenas "fazer funcionar".

## As três peças e como se conectam

```
[ Widget (client) ]  -->  chama via WCMAPI/DatasetFactory  -->  [ Dataset (server, Groovy) ]
        |
        v
[ Formulário + form.js ]  -->  eventos de ciclo de vida (beforeSaveForm, afterSaveForm...)
```

- **Widget** (`widget-exemplo/`): componente visual que aparece no portal/board.
  HTML + JS + CSS rodando no navegador, que busca dados via dataset.
- **Dataset** (`dataset-exemplo/`): fonte de dados server-side em Groovy. É a
  camada que fala com banco/APIs — nunca o widget consulta o banco direto.
- **Formulário** (`form-exemplo/`): script associado a um formulário de
  processo (workflow), reagindo a eventos do ciclo de vida do card/processo.

## Checklist de boas práticas aplicado no exemplo

**Widget**
- [ ] JS separado do HTML (nunca `onclick=""` inline nem lógica dentro da view)
- [ ] Toda chamada a dataset trata erro (a chamada pode falhar por permissão,
      timeout, dataset indisponível — nunca assuma sucesso)
- [ ] Todo dado vindo do dataset é escapado antes de virar HTML (o dataset
      pode conter texto digitado por outro usuário — é o mesmo raciocínio de
      prevenir XSS em qualquer aplicação web)

**Dataset**
- [ ] Filtra na query via `constraints`, nunca traz a tabela inteira para
      filtrar em memória
- [ ] Nunca concatena valor de parâmetro direto em SQL (SQL injection) —
      usa os mecanismos de parametrização/consulta do próprio Fluig
- [ ] Valida os parâmetros de entrada antes de montar a consulta
- [ ] Loga o erro com contexto (`Logger`) em vez de deixar a exception
      estourar sem explicação para quem for debugar depois

**Formulário**
- [ ] Usa o evento certo para cada momento do ciclo de vida (carregar card
      dentro do processo é diferente de salvar o formulário — misturar os
      dois é um erro comum de quem está começando)
- [ ] Valida campo obrigatório no client antes de deixar salvar, mas sem
      duplicar regra de negócio que já é validada no processo
- [ ] Mensagem de erro consistente, nunca um `alert()` cru

## Como estudar isto

1. Leia `dataset-exemplo/DatasetSolicitacoes.groovy` primeiro — é a fonte
   dos dados.
2. Depois `widget-exemplo/` — veja como o widget consome esse dataset.
3. Por fim `form-exemplo/form.js` — outro consumidor comum de datasets,
   mas dentro do ciclo de vida de um formulário de processo.

Este código é um exemplo de estudo (não roda fora de um ambiente Fluig real),
mas segue a estrutura e as APIs reais da plataforma.