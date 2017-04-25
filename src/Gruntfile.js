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
            //dll: {
            //   files: ["SortInPlace/Umbraco/SortInPlace/**/*.cs"],
            //    tasks: ["msbuild:dist", "copy:dll"]
            //},
            js: {
                files: ["SortInPlace/**/*.js"],
                tasks: ["concat:dist"]
            },
            html: {
                files: ["SortInPlace/**/*.html"],
                tasks: ["copy:html"]
            },
            lang: {
                files: ["SortInPlace/lang/*.xml"],
                tasks: ["copy:lang"]
            },
            sass: {
                files: ["SortInPlace/**/*.scss"],
                tasks: ["sass", "copy:css"]
            },
            css: {
                files: ["SortInPlace/**/*.css"],
                tasks: ["copy:css"]
            },
            manifest: {
                files: ["SortInPlace/package.manifest"],
                tasks: ["copy:manifest"]
            }
        },

        concat: {
            options: {
                stripBanners: false
            },
            dist: {
                src: [
                    "SortInPlace/js/sortInPlaceMediaGrid.js",
                    "SortInPlace/js/sortInPlace.controller.js",
                ],
                dest: "<%= basePath %>/js/SortInPlace.js"
            }
        },

        copy: {
            //dll: {
            //    cwd: "SortInPlace/Umbraco/SortInPlace/bin/debug/",
            //    src: [
            //        "SortInPlace.dll"
            //    ],
            //    dest: "<%= dest %>/bin/",
            //    expand: true
            //},
            html: {
                cwd: "SortInPlace/views/",
                src: ["*.html"],
                dest: "<%= basePath %>/views/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            lang: {
                cwd: "SortInPlace/lang",
                src: ["en.xml", "en-US.xml"],
                dest: "<%= basePath %>/lang/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            css: {
                cwd: "SortInPlace/css/",
                src: ["SortInPlace.css"],
                dest: "<%= basePath %>/css/",
                expand: true,
                rename: function(dest, src) {
                    return dest + src;
                }
            },
            manifest: {
                cwd: "SortInPlace/",
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
                    "SortInPlace/css/SortInPlace.css": "SortInPlace/sass/SortInPlace.scss"
                }
            }
        },

        clean: {
            build: '<%= grunt.config("basePath").substring(0, 4) == "dist" ? "dist/**/*" : "null" %>',
            tmp: ["tmp"]
        },

        msbuild: {
            options: {
                stdout: true,
                verbosity: "quiet",
                maxCpuCount: 4,
                version: 4.0,
                buildParameters: {
                    WarningLevel: 2,
                    NoWarn: 1607
                }
            },
            dist: {
                src: ["SortInPlace/Umbraco/SortInPlace.csproj"],
                options: {
                    projectConfiguration: "Debug",
                    targets: ["Clean", "Rebuild"]
                }
            }
        }
    });

    grunt.registerTask("default", [
        "concat",
        "sass:dist",
        "copy:html",
        "copy:lang",
        "copy:manifest",
        "copy:css",
        /*"msbuild:dist",*/
        /*"copy:dll"*/
    ]);

    grunt.registerTask("umbraco", [
        "clean:tmp",
        "default",
        "copy:umbraco",
        "umbracoPackage",
        "clean:tmp"
    ]);
};
