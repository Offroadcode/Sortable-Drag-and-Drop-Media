module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);
    var path = require("path");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        pkgMeta: grunt.file.readJSON("config/meta.json"),
        dest: grunt.option("target") || "dist",
        basePath: path.join(
            "<%= dest %>",
            "App_Plugins",
            "<%= pkgMeta.name %>"
        ),

        watch: {
            options: {
                spawn: false,
                atBegin: true
            },
            js: {
                files: ["SortableDragAndDropMedia/**/*.js"],
                tasks: ["concat:dist"]
            },
            html: {
                files: ["SortableDragAndDropMedia/**/*.html"],
                tasks: ["copy:html"]
            },
            sass: {
                files: ["SortableDragAndDropMedia/**/*.scss"],
                tasks: ["sass", "copy:css"]
            },
            css: {
                files: ["SortableDragAndDropMedia/**/*.css"],
                tasks: ["copy:css"]
            },
            manifest: {
                files: ["SortableDragAndDropMedia/package.manifest"],
                tasks: ["copy:manifest"]
            }
        },

        concat: {
            options: {
                stripBanners: false
            },
            dist: {
                src: [
                    "SortableDragAndDropMedia/js/SortableDragAndDropMediaGrid.js",
                    "SortableDragAndDropMedia/js/SortableDragAndDropMedia.controller.js",
                ],
                dest: "<%= basePath %>/js/SortableDragAndDropMedia.js"
            }
        },

        copy: {
            html: {
                cwd: "SortableDragAndDropMedia/views/",
                src: ["*.html"],
                dest: "<%= basePath %>/views/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            css: {
                cwd: "SortableDragAndDropMedia/css/",
                src: ["SortableDragAndDropMedia.css"],
                dest: "<%= basePath %>/css/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            manifest: {
                cwd: "SortableDragAndDropMedia/",
                src: ["package.manifest"],
                dest: "<%= basePath %>/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            umbraco: {
                cwd: "<%= dest %>",
                src: "**/*",
                dest: "tmp/umbraco",
                expand: true
            }
        },

        umbracoPackage: {
            options: {
                name: "<%= pkgMeta.name %>",
                version: "<%= pkgMeta.version %>",
                url: "<%= pkgMeta.url %>",
                license: "<%= pkgMeta.license %>",
                licenseUrl: "<%= pkgMeta.licenseUrl %>",
                author: "<%= pkgMeta.author %>",
                authorUrl: "<%= pkgMeta.authorUrl %>",
                manifest: "config/package.xml",
                readme: "config/readme.txt",
                sourceDir: "tmp/umbraco",
                outputDir: "pkg"
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            src: {
                src: ["app/**/*.js", "lib/**/*.js"]
            }
        },

        sass: {
            dist: {
                options: {
                    style: "compressed"
                },
                files: {
                    "SortableDragAndDropMedia/css/SortableDragAndDropMedia.css": "SortableDragAndDropMedia/sass/SortableDragAndDropMedia.scss"
                }
            }
        },

        clean: {
            build: '<%= grunt.config("basePath").substring(0, 4) == "dist" ? "dist/**/*" : "null" %>',
            tmp: ["tmp"]
        },
    });

    grunt.registerTask("default", [
        "concat",
        "sass:dist",
        "copy:html",
        "copy:manifest",
        "copy:css"
    ]);

    grunt.registerTask("umbraco", [
        "clean:tmp",
        "default",
        "copy:umbraco",
        "umbracoPackage",
        "clean:tmp"
    ]);
};
