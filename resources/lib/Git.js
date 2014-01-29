var chp = require('child_process');

var Git = {
	stageFile: function(modulePath, file, callback) {
		if (file.status === 'deleted') {
			this._exec(modulePath, 'rm', [file.name], callback);
		} else {
			var fileRelativePth = '.' + require('path').sep +  file.name;
			if (file.type === 'submodule' && !file.staged) {
				this._exec(modulePath, 'submodule add', [fileRelativePth], callback);
			} else {
				this._exec(modulePath, 'add', [fileRelativePth], callback);
			}
		}
	},
	
	unstageFile: function(modulePath, file, callback) {
		this._exec(modulePath, 'reset HEAD', [file.name], callback);
	},
	
	commit: function(modulePath, message, callback) {
		this._exec(modulePath, 'commit -m', [message], callback);
	},
	
	push: function(modulePath, callback) {
		this._exec(modulePath, 'push', [], callback);
	},
	
	revertFile: function(modulePath, file, callback) {
		this._exec(modulePath, 'checkout HEAD --', [file.name], callback);
	},
	
	_exec: function(modulePath, cmd, args, callback) {
		var escapedArgs = args.map(function(arg) {
			return '"' + arg.replace(/["\\]/g, '\\$1') + '"';
		}).join(' ');
		cmd = 'git ' + cmd + ' ' + escapedArgs;
		console.log('Executing:', cmd);
		chp.exec(cmd, {cwd: modulePath}, function(err, stdout, stderr) {
			if (err) console.error(err, stdout, stderr); // FIXME: why do some commands fail?
			callback(null, stdout);
		});
	}
};

module.exports = Git;