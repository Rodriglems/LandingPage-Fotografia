# LZR Fotografia

## Executando o projeto

```bash
npm install
npm run dev
```

## Painel administrativo

O painel fica disponível em `/admin` e permite atualizar:

- imagens e textos principais;
- portfólio;
- serviços;
- depoimentos;
- dados de contato.

### Configuração do Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e execute.
3. Em **Authentication > Users**, crie o usuário que terá acesso ao painel.
4. Em **Authentication > Providers > Email**, desative novos cadastros públicos.
5. Copie `.env.example` para `.env`.
6. Em **Project Settings > API**, copie a URL e a chave pública `anon` para `.env`.
7. Reinicie o servidor.

Nunca coloque a chave `service_role` no projeto. O navegador utiliza somente a chave pública `anon`; as permissões de escrita são controladas pelo login e pelas políticas configuradas no SQL.
  