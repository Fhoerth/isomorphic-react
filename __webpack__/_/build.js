const webpack = require('webpack')
const webpackIsomorphicCompiler = require('webpack-isomorphic-compiler')
const webpackClientConfig = require('./__webpack__/client.config.js').prod
const webpackServerConfig = require('./__webpack__/server.config.js')

const clientCompiler = webpack(webpackClientConfig)
const serverCompiler = webpack(webpackServerConfig)

const compiler = webpackIsomorphicCompiler(clientCompiler, serverCompiler)
compiler
  .on('begin', () => console.log('Compilation started'))
  .on('end', (stats) => {
      console.log('Compilation finished successfully');
  })
  .on('error', (err) => {
      console.log('Compilation failed')
      console.log(err.message);
      console.log(err.stats.toString());
  })
compiler.run()
