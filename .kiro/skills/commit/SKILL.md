---
name: commit
description: Crea un commit limpio siguiendo Conventional Commits a partir de los cambios actuales del workspace. Úsala cuando se quiera convertir el diff actual en un commit con título y cuerpo bien formados.
---

# /commit — Conventional Commits

Convierte los cambios actuales en un commit con formato Conventional Commits.

## Reglas estrictas del mensaje

1. **Formato del título**: `<tipo>(<scope opcional>): <descripción imperativa en minúsculas>`
   - Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
   - Máximo 72 caracteres.
   - Sin punto final.
   - Imperativo en presente: "agrega", "corrige", "elimina" — no "agregado" ni "agregando".
   - Si el usuario aporta un scope o descripción, úsalo. Si no, dedúcelos del diff.

2. **Cuerpo (opcional pero recomendado para cambios no triviales)**:
   - Línea en blanco después del título.
   - Explica el **por qué**, no el qué.
   - Líneas de hasta ~100 caracteres.
   - Bullets con `-` si hay varios puntos.

3. **Footer (solo si aplica)**:
   - `BREAKING CHANGE: <explicación>` para cambios incompatibles.
   - `Refs: #N` o `Closes: #N` si el usuario menciona issues.

4. **Prohibido en el mensaje**:
   - Mencionar asistentes de IA, modelos o herramientas asistentes (ningún nombre de producto).
   - Líneas tipo `Co-Authored-By: <asistente>`, `Generated with`, `🤖`, firmas de bots.
   - Emojis decorativos en el título (gitmoji NO).
   - Texto en mayúsculas innecesario.

## Procedimiento

1. Ejecuta en paralelo:
   - `git status` (sin `-uall`).
   - `git diff --staged` y `git diff`.
   - `git log -10 --oneline` para detectar el estilo del repo.
2. Si hay cambios sin stage, decide qué staging conviene:
   - Si el usuario lo indicó, sigue su criterio.
   - Si los cambios son cohesivos, agrégalos archivo por archivo con `git add <ruta>`.
   - **Nunca** uses `git add -A` ni `git add .`.
   - **Nunca** stagees archivos sospechosos de secretos (`.env`, claves, tokens) ni binarios pesados.
3. Si los cambios tocan áreas no relacionadas, propón al usuario partirlos en commits separados antes de continuar.
4. Redacta título y cuerpo siguiendo las reglas. Muestra al usuario el mensaje final antes de crear el commit y pídele confirmación si tienes dudas razonables.
5. Crea el commit con HEREDOC para preservar saltos de línea:

   ```bash
   git commit -m "$(cat <<'EOF'
   <tipo>(<scope>): <descripción>

   <cuerpo opcional>
   EOF
   )"
   ```

6. Si falla un hook de pre-commit, **NO** uses `--no-verify`. Reporta el error, propón un fix concreto y, una vez aplicado y re-staged, crea un commit **nuevo** (no `--amend`).
7. Después del commit, ejecuta `git status` para confirmar que el árbol quedó limpio.

## Salida esperada
- Una sola operación de commit creada.
- Mensaje cumpliendo todas las reglas anteriores.
- Resumen breve al usuario con el hash corto, el título del commit y el estado del working tree.
