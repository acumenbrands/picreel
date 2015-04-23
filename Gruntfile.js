module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-aws');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON("config/aws-config.json"),

    qunit: {
      all: ['test/**/*.html']
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },

    browserify: {
      vendor: {
        src: ['lib/**/*.js'],
        dest: 'build/picreel.js'
      },
      client: {
        src: ['lib/**/*.js'],
        dest: 'tmp/picreel.js'
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        compress: {
          global_defs: {
            "DEBUG": false
          },
          dead_code: true
        }
      },
      build: {
        files: {
          'build/picreel.min.js': ['build/picreel.js']
        }
      }
    },

    s3: {
      options: {
        //dryRun: true,
        accessKeyId: "<%= aws.AWSAccessKeyId %>",
        secretAccessKey: "<%= aws.AWSSecretKey %>",
        bucket: "<%= aws.S3Bucket %>",
        access: "<%= aws.access %>"
      },
      build: {
        cwd: "build/",
        src: "**",
        dest: "libs/picreel/<%= pkg.version %>/"
      }
    },

    cloudfront: {
      options: {
        accessKeyId: "<%= aws.AWSAccessKeyId %>",
        secretAccessKey: "<%= aws.AWSSecretKey %>",
        distributionId: "<%= aws.CloudFrontId %>"
      },
      html: {
        options: {
          invalidations: [
            "/libs/picreel/<%= pkg.version %>/picreel.js",
            "/libs/picreel/<%= pkg.version %>/picreel.min.js",
            "/libs/picreel/<%= pkg.version %>/picreel.min.js.map"
          ]
        }
      }
    }

  });

  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('test', ['build', 'qunit']);
  grunt.registerTask('export', ['uglify']);

  grunt.registerTask('default', ['test', 'export']);
  grunt.registerTask('aws', ['s3', 'cloudfront']);
  grunt.registerTask('deploy:production', ['default', 'aws']);
};
