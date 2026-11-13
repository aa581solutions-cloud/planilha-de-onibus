# Especificação — Importação inteligente DEV.13

## Objetivo
Interpretar diferentes planilhas anexadas, identificar automaticamente os dados disponíveis e importar pessoas, inscrições e informações financeiras sem depender de um modelo fixo de arquivo ou nome de aba.

## Identificação da fonte
- No XLSX, examinar as abas e selecionar a aba com melhor correspondência de cabeçalhos.
- O nome da aba não é requisito.
- No CSV ou dados colados, examinar a tabela recebida.
- Procurar cabeçalhos nas primeiras 20 linhas.
- O campo Nome é o único obrigatório.

## Campos opcionais
- Número original da inscrição.
- Telefone.
- Documento/CPF/RG.
- Tipo de documento.
- Órgão emissor do documento.
- Data de pagamento.
- Valor da passagem (valor previsto).
- Valor pago.
- Forma de pagamento.
- Saldo.
- Observações.

Se um campo não existir ou estiver vazio, deixar o dado correspondente em branco. Não inventar datas, valores ou formas de pagamento. Se um campo opcional tiver conteúdo inválido, deixar somente aquele campo em branco e mostrar um aviso; os outros dados continuam importáveis. Linha sem Nome não é importada.

## Identificação e revisão de possíveis duplicidades
1. Documento e telefone são identificadores fortes, mas conflitos entre eles exigem revisão.
2. Nome igual ou semelhante, inclusive abreviações, exige conferência manual.
3. Registros repetidos dentro do arquivo também devem ser sinalizados.
4. Pessoa já vinculada à viagem ativa deve ser encaminhada para revisão antes de alterar ou acrescentar dados.
5. Nenhuma possível duplicidade pode ser descartada ou ignorada automaticamente.
6. A revisão oferece as ações:
   - **Mesclar:** associar ao cadastro existente escolhido; completar campos vazios e preservar os dados já existentes, salvo campos que o usuário tenha editado expressamente.
   - **Editar:** corrigir os dados apresentados antes de decidir.
   - **Salvar como novo:** manter um cadastro separado, inclusive quando o nome for semelhante.
   - **Apagar da importação:** retirar somente a linha recebida da operação atual. Não apagar automaticamente cadastros ou histórico já salvos.
7. Pagamentos com mesma participação, data, valor e forma também são possíveis duplicidades: devem ser sinalizados para revisão. O usuário pode confirmar explicitamente o lançamento de outro pagamento igual quando forem parcelas legítimas.
8. A confirmação deve ser bloqueada enquanto houver revisão sem decisão.

## Integração financeira
- Valor da passagem alimenta ValorPrevisto quando informado.
- Valor pago maior que zero gera lançamento no histórico de PAGAMENTOS.
- Data de pagamento é opcional; se ausente, o pagamento é preservado com data vazia.
- Forma de pagamento e observações são copiadas quando disponíveis.
- Saldo da origem é comparado com o saldo calculado; divergências são sinalizadas, não corrigidas silenciosamente.
- Reimportações não devem duplicar lançamentos financeiros equivalentes sem revisão.

## Confirmação e segurança
- Prévia antes de gravar.
- Mostrar aba selecionada, abas examinadas, campos encontrados/ausentes, linhas sem nome, possíveis duplicidades e comparação financeira.
- Exigir decisão para todos os casos em revisão.
- Não modificar o arquivo de origem.
- Desenvolvimento ocorre na branch DEV.13; DEV.12 e produção permanecem intocadas.

## Plano de testes antes de considerar pronta
1. Nome apenas.
2. Nome + telefone, sem documento.
3. Nome + documento, sem telefone.
4. Nome + valor da passagem, sem pagamento.
5. Nome + valor pago, sem data de pagamento.
6. Nome + todos os campos financeiros.
7. Cabeçalhos com variações e acentos.
8. Aba com nome arbitrário.
9. XLSX com várias abas e apenas uma com cabeçalhos correspondentes.
10. Linha sem nome.
11. Nome igual ou semelhante com revisão manual.
12. Documento ou telefone coincidente.
13. Documento e telefone apontando para pessoas diferentes.
14. Pessoa já inscrita na viagem.
15. Repetição dentro do próprio arquivo.
16. Reimportação sem duplicar pagamentos.
17. Preservação do número de inscrição na participação.
18. Saldo da origem diferente do saldo calculado.
