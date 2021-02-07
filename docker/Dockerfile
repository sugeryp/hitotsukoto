FROM python:3.9.1-buster


RUN pip install pip --upgrade
RUN pip install ansible
# WIndows modules
RUN pip install pywinrm>=0.3.0
# vSphere modules
RUN pip install --upgrade git+https://github.com/vmware/vsphere-automation-sdk-python.git
# AWS modules
# RUN pip install boto

RUN apt -y update
RUN apt -y install sshpass

WORKDIR /work
