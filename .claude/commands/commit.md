---
description: Crea un commit con Conventional Commits a partir de los cambios actuales
argument-hint: "[scope opcional]"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*)
---

# Commit con Conventional Commits

Crea un commit limpio y bien estructurado siguiendo Conventional Commits.

## Reglas estrictas del mensaje

1. **Formato del título**: `<tipo>(<scope opcional>): <descripción imperativa en minúsculas>`
   - Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
   - El título NO debe pasar de 72 caracteres.
   - Sin punto final.
   - Imperativo en presente: "agrega", "corrige", "elimina" — no "agregado" ni "agregando".
   - Si la descripción del usuario incluye un scope (`$ARGUMENTS`), úsalo entre paréntesis. Si no, deduce uno razonable del diff o omítelo.

2. **Cuerpo (opcional, recomendado para cambios no triviales)**:
   - Una línea en blanco después del título.
   - Explica el **por qué**, no el qué (el diff ya muestra el qué).
   - Líneas de máximo ~100 caracteres.
   - Bullets con `-` si hay varios puntos.

3. **Footer (solo si aplica)**:
   - `BREAKING CHANGE: <explicación>` para cambios incompatibles.
   - `Refs: #123` o `Closes: #123` si el usuario menciona un issue.

4. **Prohibido en el mensaje**:
   - Cualquier mención a asistentes de IA, modelos, herramientas de IA, o nombres de productos asistentes.
   - Líneas tipo `Co-Authored-By: <asistente>`, `Generated with`, `🤖`, firmas de bots, etc.
   - Emojis decorativos en el título (gitmoji NO).
   - Texto en mayúsculas innecesario.

## Procedimiento

1. Ejecuta en paralelo:
   - `git status` (sin `-uall`) para ver archivos modificados y untracked.
   - `git diff --staged` y `git diff` para ver cambios.
   - `git log -10 --oneline` para detectar el estilo del repo.
2. Si no hay cambios staged y sí hay cambios sin stage, pregunta cuál staging quiere el usuario o, si es claro y seguro, agrega los archivos relevantes con `git add <ruta>` (NUNCA `git add -A` ni `git add .`). No agregues archivos que parezcan secretos (`.env`, claves, tokens) ni binarios pesados.
3. Analiza los cambios y redacta el mensaje siguiendo las reglas. Si el cambio toca varias áreas no relacionadas, sugiere al usuario partirlo en commits separados antes de seguir.
4. Crea el commit con HEREDOC para preservar formato:
   ```
   git commit -m "$(cat <<'EOF'
   <tipo>(<scope>): <descripción>

   <cuerpo opcional>
   EOF
   )"
   ```
5. Si falla un hook de pre-commit, NO uses `--no-verify`. Reporta el error, propón un fix, y crea un commit NUEVO después de arreglarlo (no `--amend`).
6. Después del commit, ejecuta `git status` para confirmar que el árbol quedó limpio y muestra al usuario el resultado.

## Argumentos

`$ARGUMENTS` — si el usuario pasa texto, trátalo como hint de scope o de descripción. Si está vacío, deduce todo del diff.
