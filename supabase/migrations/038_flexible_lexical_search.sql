-- ============================================================
-- 038_flexible_lexical_search.sql — Búsqueda Léxica Flexible
--
-- Actualiza la función de búsqueda de texto completo (FTS) para que 
-- utilice coincidencias parciales (OR) en lugar de estrictas (AND).
-- Esto permite que consultas largas y conversacionales encuentren
-- resultados relevantes usando Lexical Search sin necesitar una 
-- llave de Embeddings vectorial.
-- ============================================================

CREATE OR REPLACE FUNCTION public.match_ai_knowledge_fts(
  p_account_id  uuid,
  p_query       text,
  p_match_count integer
)
RETURNS TABLE (id uuid, content text, rank real) AS $$
  DECLARE
    v_query_or tsquery;
  BEGIN
    -- plainto_tsquery limpia puntuación y formatea: 'palabra1' & 'palabra2'
    -- Al reemplazar '&' por '|', convertimos la búsqueda estricta (AND) 
    -- en una búsqueda flexible (OR) donde cualquier palabra suma puntos de relevancia.
    v_query_or := nullif(replace(plainto_tsquery('simple', p_query)::text, '&', '|'), '')::tsquery;

    IF v_query_or IS NULL THEN
      RETURN;
    END IF;

    RETURN QUERY
    SELECT c.id,
           c.content,
           ts_rank(c.fts, v_query_or) AS rank
    FROM ai_knowledge_chunks c
    WHERE c.account_id = p_account_id
      AND c.fts @@ v_query_or
    ORDER BY rank DESC
    LIMIT GREATEST(p_match_count, 0);
  END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Reaplicar permisos
REVOKE ALL ON FUNCTION public.match_ai_knowledge_fts(uuid, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.match_ai_knowledge_fts(uuid, text, integer) TO authenticated, service_role;
