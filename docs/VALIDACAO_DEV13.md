# Validação técnica — DEV.13

## Verificações executadas no código versionado

- Sintaxe JavaScript de `Code.gs`: aprovada.
- Sintaxe JavaScript de `SmartImport.gs`: aprovada.
- Sintaxe do script de `Main.html`: aprovada.
- Testes puros de importação: 6 de 6 aprovados:
  - Cabeçalho contendo somente Nome.
  - Cabeçalhos com variações, acentos e número de inscrição.
  - Cabeçalhos comuns de passagem e pagamento.
  - Valor monetário brasileiro.
  - Data brasileira.
  - Campos opcionais vazios.

## Revisão manual de possíveis duplicidades — alteração atual

- Possíveis duplicidades não devem ser ignoradas automaticamente.
- A interface da importação inteligente agora solicita uma decisão por linha em revisão.
- Ações disponíveis: mesclar com cadastro escolhido, editar os campos antes da gravação, salvar como novo cadastro ou apagar a linha somente da importação atual.
- Pessoas já vinculadas à viagem ativa são encaminhadas para revisão.
- Repetições no próprio arquivo continuam em revisão e mantêm candidatos encontrados nos cadastros existentes.
- Pagamentos com mesma participação, data, valor e forma são sinalizados para revisão; a interface permite confirmar explicitamente outro lançamento igual.
- Ações destrutivas sobre cadastros existentes não são realizadas pela opção “apagar da importação”.
- A importação em lote legada é bloqueada quando detecta duplicidades e direciona o usuário à Importação Inteligente, evitando descarte silencioso.
- O backend bloqueia a confirmação quando uma linha em revisão não possui decisão.

## Correção adicional da revisão estática

- Mapeamento do órgão emissor do documento adicionado à importação inteligente.
- O órgão emissor e o tipo de documento podem ser corrigidos na tela de revisão.
- Ao mesclar, campos editados expressamente podem atualizar tipo e órgão emissor; ao criar pessoa, o órgão emissor é gravado no campo próprio.

## Limites desta validação

Os testes de sintaxe e os seis testes puros foram executados em ambiente isolado. Eles não representam teste de ponta a ponta dentro de uma planilha Google real. Permanecem pendentes:
- Executar a função de autoverificação no Apps Script vinculado a uma cópia de teste.
- Testar conversão real de XLSX com várias abas via Drive API v3.
- Testar as ações de mesclagem, edição, novo cadastro e remoção da linha em uma cópia descartável.
- Testar confirmação explícita de pagamentos com assinatura igual e prevenção de reimportação acidental.
- Testar gravação e reimportação em cópia descartável da planilha.
- Conferir totais financeiros e relatórios com dados de teste.
- Testar a mensagem de bloqueio da importação em lote legada quando houver duplicidades.

## Segurança de implantação

Nenhuma planilha real foi aberta ou alterada por esta etapa. Nenhuma publicação ou implantação em produção foi realizada. A DEV.12 permanece preservada.
