import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Configuración de la consola interactiva
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const pregunta = (texto, valorPorDefecto) => {
  return new Promise((resolve) => {
    const promptText = valorPorDefecto ? `${texto} (${valorPorDefecto}): ` : `${texto}: `;
    rl.question(promptText, (respuesta) => {
      resolve(respuesta.trim() || valorPorDefecto);
    });
  });
};

// Función auxiliar para reemplazar contenido en un archivo de forma segura
const reemplazarEnArchivo = (rutaRelativa, reemplazos) => {
  const rutaAbsoluta = path.join(process.cwd(), rutaRelativa);
  if (!fs.existsSync(rutaAbsoluta)) {
    console.warn(`⚠️ Archivo no encontrado para reemplazo: ${rutaRelativa}`);
    return;
  }

  let contenido = fs.readFileSync(rutaAbsoluta, 'utf-8');
  let modificado = false;

  for (const [buscar, reemplazar] of Object.entries(reemplazos)) {
    // Si buscar es un string que representa una expresión regular o texto directo
    const regex = buscar.startsWith('/') && buscar.endsWith('/')
      ? new RegExp(buscar.slice(1, -1), 'g')
      : new RegExp(buscar.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
    
    if (regex.test(contenido)) {
      contenido = contenido.replace(regex, reemplazar);
      modificado = true;
    }
  }

  if (modificado) {
    fs.writeFileSync(rutaAbsoluta, contenido, 'utf-8');
    console.log(`✅ Actualizado: ${rutaRelativa}`);
  }
};

// Función auxiliar para eliminar archivos/directorios de forma recursiva
const eliminarRuta = (rutaRelativa) => {
  const rutaAbsoluta = path.join(process.cwd(), rutaRelativa);
  if (fs.existsSync(rutaAbsoluta)) {
    const stats = fs.statSync(rutaAbsoluta);
    if (stats.isDirectory()) {
      fs.rmSync(rutaAbsoluta, { recursive: true, force: true });
    } else {
      fs.unlinkSync(rutaAbsoluta);
    }
    console.log(`🗑️ Eliminado: ${rutaRelativa}`);
  }
};

const main = async () => {
  console.clear();
  console.log('======================================================');
  console.log('       SCAFFOLDER INTERACTIVO DE NUEVO PROYECTO       ');
  console.log('======================================================\n');
  console.log('Este script configurará este repositorio para un nuevo proyecto.');
  console.log('Presiona Enter para aceptar los valores por defecto.\n');

  try {
    const nonInteractive = process.argv.includes('--clean') || process.argv.includes('--non-interactive');
    
    let nombreProyecto = 'desarrollo-inteligente';
    let tituloProyecto = 'Blueprint Maestro';
    let puertoFrontend = '3000';
    let puertoBackend = '3001';
    let dbName = 'desarrollo';
    let limpiarIdeas = false;

    if (nonInteractive) {
      limpiarIdeas = true;
      console.log('🔧 Modo no interactivo activo (--clean). Usando configuraciones predeterminadas con limpieza de Ideas.');
    } else {
      // 1. Obtener parámetros del usuario interactivos
      nombreProyecto = await pregunta('1. Nombre del proyecto (kebab-case)', 'nuevo-proyecto');
      if (!/^[a-z0-9-]+$/.test(nombreProyecto)) {
        throw new Error('El nombre del proyecto debe estar en formato kebab-case (letras minúsculas, números y guiones).');
      }

      tituloProyecto = await pregunta('2. Título legible para la interfaz', 'Nuevo Proyecto');
      puertoFrontend = await pregunta('3. Puerto para el Frontend', '3000');
      puertoBackend = await pregunta('4. Puerto para el Backend', '3001');
      dbName = await pregunta('5. Nombre de la base de datos', nombreProyecto.replace(/-/g, '_'));
      const limpiarIdeasRaw = await pregunta('6. ¿Deseas eliminar la aplicación de Ideas de referencia? (s/N)', 'n');
      limpiarIdeas = limpiarIdeasRaw.toLowerCase() === 's';
    }

    console.log('\n--- Resumen de Configuración ---');
    console.log(`Nombre del Proyecto: ${nombreProyecto}`);
    console.log(`Título Legible:     ${tituloProyecto}`);
    console.log(`Puerto Frontend:    ${puertoFrontend}`);
    console.log(`Puerto Backend:     ${puertoBackend}`);
    console.log(`Base de Datos:      ${dbName}`);
    console.log(`Limpiar App Ideas:  ${limpiarIdeas ? 'SÍ' : 'NO'}`);
    console.log('--------------------------------\n');

    if (!nonInteractive) {
      const confirmar = await pregunta('¿Confirmas que deseas aplicar estos cambios? (s/N)', 'n');
      if (confirmar.toLowerCase() !== 's') {
        console.log('❌ Operación cancelada por el usuario.');
        rl.close();
        return;
      }
    }

    console.log('\n🚀 Aplicando cambios estructurales...\n');

    // 2. Modificaciones de configuración básicas (Nombres, Puertos, Bases de Datos)
    
    // package.json de la raíz
    reemplazarEnArchivo('package.json', {
      '"name": "desarrollo-inteligente"': `"name": "${nombreProyecto}"`,
      'eyak69/desarrollo-inteligente': `proyectos/${nombreProyecto}`
    });

    // package-lock.json de la raíz
    reemplazarEnArchivo('package-lock.json', {
      '"name": "desarrollo-inteligente"': `"name": "${nombreProyecto}"`
    });

    // .env.example y .env
    const envReemplazos = {
      'DB_NAME=desarrollo': `DB_NAME=${dbName}`,
      'PORT=3001': `PORT=${puertoBackend}`,
      'localhost:3001': `localhost:${puertoBackend}`
    };
    reemplazarEnArchivo('.env.example', envReemplazos);
    reemplazarEnArchivo('.env', envReemplazos);

    // docker-compose.yml
    reemplazarEnArchivo('docker-compose.yml', {
      '"3001:3001"': `"${puertoBackend}:${puertoBackend}"`,
      '"3000:3000"': `"${puertoFrontend}:${puertoFrontend}"`,
      'localhost:3001': `localhost:${puertoBackend}`
    });

    // client/vite.config.ts
    reemplazarEnArchivo('client/vite.config.ts', {
      'port: 3000': `port: ${puertoFrontend}`,
      "target: 'http://localhost:3001'": `target: 'http://localhost:${puertoBackend}'`
    });

    // client/index.html
    reemplazarEnArchivo('client/index.html', {
      '<title>Blueprint Maestro de Desarrollo Inteligente</title>': `<title>${tituloProyecto}</title>`
    });

    // Fallbacks de bases de datos en scripts y archivos del servidor
    const dbFallbacks = {
      "'desarrollo'": `'${dbName}'`
    };
    reemplazarEnArchivo('server/src/config/knexfile.ts', dbFallbacks);
    reemplazarEnArchivo('server/scripts/create-db.js', dbFallbacks);
    reemplazarEnArchivo('server/dump-db.js', dbFallbacks);

    // 3. Limpieza opcional de la aplicación de Ideas
    if (limpiarIdeas) {
      console.log('\n🧹 Limpiando la aplicación de Ideas de referencia...');

      // Eliminar archivos de frontend
      eliminarRuta('client/src/features/ideas');
      eliminarRuta('client/src/services/ideaService.ts');

      // Modificar Layout.tsx para remover ideas del menú
      const layoutTsxAbs = path.join(process.cwd(), 'client/src/components/layout/Layout.tsx');
      if (fs.existsSync(layoutTsxAbs)) {
        let layoutContenido = fs.readFileSync(layoutTsxAbs, 'utf-8');
        
        // Remover el item de menú de ideas
        layoutContenido = layoutContenido.replace(
          /\{\s*text:\s*'Laboratorio de Ideas',\s*icon:\s*<IdeasIcon\s*\/>,\s*path:\s*'\/ideas'\s*\},?\r?\n/,
          ''
        );
        // Remover el import de IdeasIcon para evitar errores de linter
        layoutContenido = layoutContenido.replace(
          /\s*Lightbulb as IdeasIcon,\r?\n/,
          ''
        );
        // Cambiar la selección hardcodeada a Dashboard
        layoutContenido = layoutContenido.replace(
          /=== 'Laboratorio de Ideas'/g,
          "=== 'Dashboard'"
        );
        
        fs.writeFileSync(layoutTsxAbs, layoutContenido, 'utf-8');
        console.log('✅ Layout.tsx saneado de referencias de Ideas.');
      }

      // Modificar App.tsx para dejar un layout de bienvenida limpio
      const appTxsAbs = path.join(process.cwd(), 'client/src/App.tsx');

      if (fs.existsSync(appTxsAbs)) {
        const appCleanContent = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/layout/Layout';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster 
          richColors 
          closeButton 
          position="top-right"
          theme="dark"
        />
        <Layout>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '60vh', 
            color: '#fff', 
            textAlign: 'center', 
            padding: '20px' 
          }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '20px', 
              background: 'linear-gradient(45deg, #a855f7, #3b82f6)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700
            }}>
              ${tituloProyecto}
            </h1>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '1.1rem', 
              maxWidth: '600px',
              lineHeight: 1.6,
              fontFamily: 'Inter, sans-serif'
            }}>
              El proyecto ha sido andamiado correctamente utilizando el Blueprint de Desarrollo Inteligente.
              Comienza a desarrollar tus módulos verticales bajo <code>server/src/modules/</code> y tus componentes frontend en <code>client/src/features/</code>.
            </p>
          </div>
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
`;
        fs.writeFileSync(appTxsAbs, appCleanContent, 'utf-8');
        console.log('✅ App.tsx del cliente reconfigurado en limpio.');
      }

      // Eliminar archivos de backend
      eliminarRuta('server/src/routes/idea.routes.ts');
      eliminarRuta('server/src/controllers/idea.controller.ts');
      eliminarRuta('server/src/controllers/idea.controller.test.ts');
      eliminarRuta('server/src/repositories/idea.repository.ts');
      eliminarRuta('server/src/repositories/idea.repository.integration.test.ts');
      eliminarRuta('server/src/schemas/idea.schema.ts');
      eliminarRuta('server/src/services/idea.service.ts');
      eliminarRuta('server/dump-db.js');
      
      // Eliminar semillas de ideas
      eliminarRuta('server/src/database/seeds/01_initial_ideas.ts');


      // Eliminar migraciones de ideas de forma dinámica
      const migrationsDir = path.join(process.cwd(), 'server/src/database/migrations');
      if (fs.existsSync(migrationsDir)) {
        const archivosMigracion = fs.readdirSync(migrationsDir);
        for (const archivo of archivosMigracion) {
          if (archivo.includes('ideas')) {
            eliminarRuta(`server/src/database/migrations/${archivo}`);
          }
        }
      }

      // Limpiar imports en server/src/index.ts
      const indexTsAbs = path.join(process.cwd(), 'server/src/index.ts');
      if (fs.existsSync(indexTsAbs)) {
        let indexContenido = fs.readFileSync(indexTsAbs, 'utf-8');
        
        // Quitar la importación de rutas
        indexContenido = indexContenido.replace(/import ideaRoutes from '\.\/routes\/idea\.routes';\r?\n/, '');
        // Quitar el registro en la app express
        indexContenido = indexContenido.replace(/app\.use\('\/api\/ideas', ideaRoutes\);\r?\n/, '');
        
        fs.writeFileSync(indexTsAbs, indexContenido, 'utf-8');
        console.log('✅ index.ts del servidor saneado de referencias de Ideas.');
      }

      // Eliminar tests de carga
      eliminarRuta('tests/load');
    }

    console.log('\n✨ ¡Andamiaje completado con éxito! ✨');
    console.log('Ejecuta "npm install" si es un clon limpio, y luego levanta tus contenedores con "docker-compose up -d".\n');

  } catch (error) {
    console.error(`\n❌ Error durante el andamiaje: ${error.message}`);
  } finally {
    rl.close();
  }
};

main();
