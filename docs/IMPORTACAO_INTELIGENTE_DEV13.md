# Especificação — Importação inteligente DEV.13

## Objetivo
Permitir importar uma planilha Excel ou CSV como fonte única de pessoas, inscrições e informações financeiras, sem depender do nome da aba nem de um modelo fixo de colunas.

## Identificação da fonte
- No XLSX, examinar as abas e selecionar a aba com melhor correspondência de cabeçalhos.
- O nome da aba não é requisito.
- No CSV ou dados colados, examinar a tabela recebida.
- Procurar cabeçalhos nas primeiras 20 linhas.
- O campo Nome é o único obrigatório.

## Campos opcionais
- Telefone.
- Documento/CPF/RG.
- Tipo de documento.
- Data de pagamento.
- Valor da passagem (valor previsto).
- Valor pago.
- Forma de pagamento.
- Saldo.
- Observações.

Se um campo não existir ou estiver vazio, deixar o dado correspondente em branco. Não inventar datas, valores ou formas de pagamento. Linha sem Nome não é importada.

## Identificação e duplicidades
1. Documento coincidente é o primeiro identificador forte.
2. Telefone coincidente é o segundo identificador forte.
3. Nome igual ou semelhante, inclusive abreviações como “Adam” e “Adam Alves”, exige conferência manual.
4. Não mesclar nem descartar pessoas apenas pela semelhança do nome.
5. A prévia oferece decisão entre associar a um cadastro existente ou cadastrar uma nova pessoa.
6. A mesma pessoa não deve receber uma segunda inscrição na mesma viagem.

## Integração financeira
- Valor da passagem alimenta ValorPrevisto quando informado.
- Valor pago maior que zero gera lançamento no histórico de PAGAMENTOS.
- Data de pagamento é opcional; se ausente, o pagamento é preservado com data vazia.
- Forma de pagamento e observações são copiadas quando disponíveis.
- Saldo da origem é comparado com o saldo calculado; divergências são sinalizadas, não corrigidas silenciosamente.
- A reimportação deve evitar repetir lançamentos financeiros equivalentes.

## Confirmação e segurança
- Prévia antes de gravar.
- Mostrar aba selecionada, abas examinadas, campos encontrados/ausentes, linhas sem nome, possíveis duplicidades e comparação financeira.
- Exigir decisão para todos os casos ambíguos.
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
11. “Adam” e “Adam Alves” com revisão manual.
12. Documento ou telefone coincidente.
13. Pessoa já inscrita na viagem.
14. Reimportação sem duplicar pagamentos.
15. Saldo da origem diferente do saldo calculado.
