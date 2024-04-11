// Importa las dependencias necesarias
var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));

// Define la tarea 'sass'
gulp.task('sass', function() {
    return gulp.src('../**/*.scss') // Obtiene todos los archivos .scss en la ruta especificada
        .pipe(sass()) // Compila los archivos SASS a CSS
        .pipe(gulp.dest('../../')) // Guarda los archivos CSS compilados en la ruta especificada
});

// Define la tarea 'watch'
gulp.task('watch', function() {
    gulp.watch('../**/*.scss', gulp.series('sass')); // Observa cambios en los archivos SASS y ejecuta la tarea 'sass' cuando se detectan cambios
});

// Define la tarea por defecto
gulp.task('default', gulp.series('watch')); // Ejecuta la tarea 'watch' por defecto cuando se ejecuta 'gulp'
