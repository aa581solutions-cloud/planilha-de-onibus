# Validação técnica — DEV.13

## Verificações executadas no código versionado

- Sintaxe JavaScript de `Code.gs`: aprovada.
- Sintaxe JavaScript de `SmartImport.gs`: aprovada.
- Sintaxe do script de `Main.html`: aprovada.
- Testes puros de importação: 6 de 6 aprovados.
  - Cabeçalho contendo somente Nome.
  - Cabeçalhos com variações, acentos e número de inscrição.
  - Cabeçalhos usados em planilhas Betel: `Nº`, `Nome`, `Data pagamento`, `Passagem`, `Valor pago`, `Pagamento` e `Saldo/Troco`.
  - Valor monetário brasileiro.
  - Data brasileira.
  - Campos opcionais vazios.
- Simulação de linha com apenas Nome: classificada como novo cadastro, sem valor previsto ou pagamento inventado.
- Simulação de “Adam” diante de cadastro “Adam Alves”: classificada para revisão manual.
- Valores opcionais inválidos geram aviso e não impedem o cadastro da pessoa.
- Simulação de linha completa: mapeou Nº 005, data 13/11/2026, passagem R$ 150,00, pago R$ 50,00, PIX e saldo R$ 100,00; saldo calculado coincidiu com a origem.
- Branch DEV.12 consultada após a criação da DEV.13 e permaneceu identificada como versão 0.1.0-dev.12.

## Limites desta validação

Estas verificações foram feitas sobre o código e funções puras em ambiente isolado. Ainda não representam teste de ponta a ponta dentro de uma planilha Google real. Permanecem pendentes:
- Executar a função de autoverificação no Apps Script vinculado à cópia de teste.
- Testar conversão real de XLSX com várias abas via Drive API v3.
- Testar gravação e reimportação em uma cópia descartável da planilha.
- Conferir totais financeiros e relatórios com uma amostra representativa da planilha de origem.
- Validar a preservação do histórico e o comportamento de possíveis homônimos na interface real.

## Segurança de implantação

Nenhuma planilha real foi aberta ou alterada por esta etapa. Nenhuma publicação ou implantação no ambiente de produção foi realizada. A DEV.12 permanece preservada.
